/* ============================================================
 * 语音模块：封装浏览器原生 Web Speech API + 可插拔的“后端语音识别”
 *
 * 两种识别提供方（provider）：
 *   - 'browser'（默认）：使用浏览器原生 SpeechRecognition，免费、无需后端；
 *                        但在大陆网络下 Chrome 的英文/中文识别后端可能连不上，
 *                        会自动降级为“自检跟读”。
 *   - 'proxy'  ：通过后端中转调用国内语音识别（讯飞/百度/腾讯等），
 *               真正可在国内给发音打分。需要部署 asr-proxy-server.example.js
 *               并把 Voice.setProvider('proxy', 'https://你的后端/asr') 指过去。
 *
 * 对外接口（保持兼容）：
 *   Voice.speak(text, opts)        朗读（TTS）
 *   Voice.recognize(lang, timeout) 识别，返回 {success, alternatives, error}
 *   Voice.matchScore(a, b)         归一化比对得分 0~1
 *   Voice.hasRecognition           浏览器是否支持原生识别
 *   Voice.setProvider(p, url)      切换识别提供方
 *   Voice.config                   当前配置（provider / asrProxyUrl）
 * ============================================================ */

const Voice = (function () {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const hasRecognition = !!SR;
  let ttsReady = 'speechSynthesis' in window;

  // 识别提供方配置
  const config = {
    provider: 'browser', // 'browser' | 'proxy'
    asrProxyUrl: ''      // 后端中转地址（provider==='proxy' 时必填）
  };
  function setProvider(p, url) {
    config.provider = p;
    if (url) config.asrProxyUrl = url;
  }

  function warmUpTTS() {
    if (!ttsReady) return;
    try {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = function () {
        window.speechSynthesis.getVoices();
      };
    } catch (e) { /* ignore */ }
  }
  warmUpTTS();

  // 朗读文本
  function speak(text, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      if (!ttsReady) { resolve(false); return; }
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = opts.lang || 'en-US';
        u.rate = opts.rate != null ? opts.rate : 0.85;
        u.pitch = opts.pitch != null ? opts.pitch : 1.15;
        u.volume = opts.volume != null ? opts.volume : 1;
        u.onend = function () { resolve(true); };
        u.onerror = function () { resolve(false); };
        window.speechSynthesis.speak(u);
      } catch (e) {
        resolve(false);
      }
    });
  }

  // 浏览器原生识别
  function recognizeBrowser(lang, timeout) {
    lang = lang || 'en-US';
    timeout = timeout || 9000;
    return new Promise(function (resolve) {
      if (!hasRecognition) { resolve({ success: false, error: 'no-support' }); return; }
      let done = false;
      const rec = new SR();
      rec.lang = lang;
      rec.interimResults = false;
      rec.continuous = false;
      rec.maxAlternatives = 4;

      function finish(val) {
        if (done) return;
        done = true;
        try { rec.onend = null; rec.onresult = null; rec.onerror = null; rec.stop(); } catch (e) {}
        resolve(val);
      }

      rec.onresult = function (e) {
        const alts = [];
        const result = e.results[0];
        for (let i = 0; i < result.length; i++) alts.push(result[i].transcript);
        finish({ success: true, alternatives: alts });
      };
      rec.onerror = function (e) {
        finish({ success: false, error: (e && e.error) || 'error' });
      };
      rec.onend = function () {
        if (!done) finish({ success: false, error: 'end' });
      };

      try { rec.start(); } catch (e) { finish({ success: false, error: 'start-failed' }); }

      setTimeout(function () {
        if (!done) { try { rec.stop(); } catch (e) {} finish({ success: false, error: 'timeout' }); }
      }, timeout);
    });
  }

  // 通过后端中转识别：录音 -> POST 到 asrProxyUrl -> 返回文本
  // 后端约定：POST 原始音频（webm/ogg），Header X-Lang 传语言；
  //          响应 JSON：{ "text": "识别出的文字" } 或 { "error": "..." }
  function recognizeProxy(lang, timeout) {
    timeout = timeout || 6000;
    return new Promise(function (resolve) {
      if (!config.asrProxyUrl) { resolve({ success: false, error: 'no-proxy-url' }); return; }
      if (!navigator.mediaDevices || !window.MediaRecorder) {
        resolve({ success: false, error: 'no-media-recorder' }); return;
      }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        let mime = 'audio/webm';
        try { if (window.MediaRecorder.isTypeSupported('audio/webm')) mime = 'audio/webm'; } catch (e) {}
        const rec = new MediaRecorder(stream);
        const chunks = [];
        rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
        rec.onstop = function () {
          stream.getTracks().forEach(function (t) { t.stop(); });
          const blob = new Blob(chunks, { type: mime });
          const headers = { 'X-Lang': lang || 'zh-CN' };
          fetch(config.asrProxyUrl, { method: 'POST', body: blob, headers: headers })
            .then(function (r) { return r.json(); })
            .then(function (j) {
              if (j && j.text) resolve({ success: true, alternatives: [j.text] });
              else resolve({ success: false, error: (j && j.error) || 'empty' });
            })
            .catch(function () { resolve({ success: false, error: 'fetch-fail' }); });
        };
        try { rec.start(); } catch (e) { resolve({ success: false, error: 'rec-start-fail' }); }
        setTimeout(function () { try { rec.stop(); } catch (e) {} }, timeout);
      }).catch(function () {
        resolve({ success: false, error: 'mic-denied' });
      });
    });
  }

  // 统一入口：根据 provider 选择识别方式
  function recognize(lang, timeout) {
    if (config.provider === 'proxy' && config.asrProxyUrl) {
      return recognizeProxy(lang, timeout);
    }
    return recognizeBrowser(lang, timeout);
  }

  function normalize(s) {
    return (s || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function matchScore(transcript, target) {
    const t = normalize(transcript);
    const g = normalize(target);
    if (!t) return 0;
    if (t === g) return 1;
    const gw = g.split(' ').filter(Boolean);
    const tw = t.split(' ').filter(Boolean);
    if (gw.length <= 1) {
      return tw.indexOf(gw[0]) >= 0 ? 1 : 0;
    }
    const inter = tw.filter(function (w) { return gw.indexOf(w) >= 0; }).length;
    return inter / gw.length;
  }

  return {
    speak: speak,
    recognize: recognize,
    recognizeBrowser: recognizeBrowser,
    recognizeProxy: recognizeProxy,
    normalize: normalize,
    matchScore: matchScore,
    hasRecognition: hasRecognition,
    ttsReady: ttsReady,
    setProvider: setProvider,
    config: config
  };
})();

if (typeof window !== 'undefined') window.Voice = Voice;
