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

  let voicesCache = [];
  function refreshVoices() {
    try { voicesCache = window.speechSynthesis.getVoices() || []; } catch (e) { voicesCache = []; }
  }
  function warmUpTTS() {
    if (!ttsReady) return;
    try {
      refreshVoices();
      window.speechSynthesis.onvoiceschanged = refreshVoices;
      // 某些浏览器（尤其 Edge/WebView）不触发 onvoiceschanged，主动轮询几秒直到拿到发音人
      let n = 0;
      const iv = setInterval(function () {
        refreshVoices();
        if (voicesCache.length || ++n > 40) { clearInterval(iv); }
      }, 200);
    } catch (e) { /* ignore */ }
  }
  warmUpTTS();

  // 选发音人：同语言 → 同语种前缀；同类里优先「本地引擎」。
  // 关键：国内网络下 Google 网络语音(Google 普通话/US English)连不上会静默无声，本地引擎最稳。
  function pickVoice(lang) {
    if (!voicesCache.length) refreshVoices();
    if (!voicesCache.length) return null;
    const pref = (lang || 'en-US').toLowerCase();
    const prefix = pref.split('-')[0];
    const norm = (l) => (l || '').toLowerCase().replace('_', '-');
    const byExact = voicesCache.filter((v) => norm(v.lang) === pref);
    const byPrefix = voicesCache.filter((v) => norm(v.lang).indexOf(prefix) === 0);
    const localFirst = (arr) => arr.slice().sort((a, b) => (b.localService ? 1 : 0) - (a.localService ? 1 : 0));
    const pool = localFirst(byExact).concat(localFirst(byPrefix));
    return pool[0] || null;
  }

  // 持有当前 utterance 引用：部分浏览器会把它回收，导致读到一半没声（Chrome 已知问题）
  let currentUtterance = null;
  let lastTtsError = '';

  // 朗读文本（四重保护：GC引用 / 空闲等待 / 超时兜底 / 无声重试）
  // Edge 实测两个坑：① 未被引用的 Utterance 会被垃圾回收 → 无声且回调全丢；
  //                  ② 引擎忙时（voices 未就绪/上一条未清完）直接 speak 会楔死。
  function speak(text, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      if (!ttsReady) { lastTtsError = 'no-speech-synthesis'; resolve(false); return; }
      const synth = window.speechSynthesis;
      let settled = false, started = false, watchdog = null;
      function done(ok) {
        if (settled) return;
        settled = true;
        if (watchdog) { clearTimeout(watchdog); watchdog = null; }
        resolve(ok);
      }
      function begin() {
        try {
          const u = new SpeechSynthesisUtterance(text);
          u.lang = opts.lang || 'en-US';
          const v = pickVoice(u.lang);
          if (v) { try { u.voice = v; } catch (e) {} }
          u.rate = opts.rate != null ? opts.rate : 0.85;
          u.pitch = opts.pitch != null ? opts.pitch : 1.15;
          u.volume = opts.volume != null ? opts.volume : 1;
          currentUtterance = u; // 防 GC：必须全程持引用，否则 Edge 会静默杀掉发音
          u.onstart = function () { started = true; };
          u.onend = function () { done(true); };
          u.onerror = function (e) { lastTtsError = (e && e.error) || 'tts-error'; done(false); };
          try { synth.speak(u); } catch (e) { lastTtsError = 'speak-throw'; done(false); }
          // 超时兜底：个别引擎（Edge 楔死态）onend 永远不来，到时强制收尾，绝不让流程挂起
          const maxMs = 4000 + String(text).length * 180;
          watchdog = setTimeout(function () {
            if (settled) return;
            lastTtsError = started ? '' : 'tts-timeout';
            try { synth.cancel(); } catch (e) {}
            try { synth.resume(); } catch (e) {}
            done(started); // 开口了就算成功（有的引擎不触发 onend 但声音正常）
          }, maxMs);
          // 无声重试：1.6s 还没开口，cancel 后用默认发音人再试一次
          setTimeout(function () {
            if (!started && !settled) {
              try {
                synth.cancel();
                const u2 = new SpeechSynthesisUtterance(text);
                u2.lang = opts.lang || 'en-US';
                u2.rate = opts.rate != null ? opts.rate : 0.85;
                currentUtterance = u2;
                u2.onend = function () { done(true); };
                u2.onerror = function (e) { lastTtsError = (e && e.error) || 'tts-error'; done(false); };
                synth.speak(u2);
              } catch (e) { lastTtsError = 'speak-throw'; }
            }
          }, 1600);
        } catch (e) { lastTtsError = 'speak-throw'; done(false); }
      }
      try {
        synth.cancel();
        try { synth.resume(); } catch (e) {}
        // 等引擎真正空闲再开口（Edge 上一条没清完就 speak 会楔死）
        let waited = 0;
        const iv = setInterval(function () {
          waited += 60;
          const idle = !synth.speaking && !synth.pending;
          if (idle || settled || waited >= 900) {
            clearInterval(iv);
            if (!settled) setTimeout(begin, 80);
          }
        }, 60);
      } catch (e) { lastTtsError = 'speak-throw'; done(false); }
    });
  }

  /* ---------------- WebAudio 提示音：不依赖 TTS 引擎，任何手机都出声 ---------------- */
  let audioCtx = null;
  function ensureCtx() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === 'suspended' && audioCtx.resume) { try { audioCtx.resume(); } catch (e) {} }
      return audioCtx;
    } catch (e) { return null; }
  }
  function tone(ctx, freq, t0, dur, type, gainV) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gainV || 0.25, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }
  // kind: 'click' | 'correct' | 'wrong' | 'win'
  function beep(kind) {
    const ctx = ensureCtx();
    if (!ctx) return Promise.resolve(false);
    const now = ctx.currentTime + 0.02;
    if (kind === 'wrong') {
      tone(ctx, 220, now, 0.22, 'square', 0.12);
      tone(ctx, 175, now + 0.12, 0.26, 'square', 0.10);
    } else if (kind === 'correct') {
      tone(ctx, 660, now, 0.12);
      tone(ctx, 880, now + 0.1, 0.18);
    } else if (kind === 'win') {
      [523, 659, 784, 1046].forEach((f, i) => tone(ctx, f, now + i * 0.12, 0.22));
    } else {
      tone(ctx, 880, now, 0.15);
    }
    return Promise.resolve(true);
  }

  /* ---------------- 声音诊断（供「声音测试」页显示） ---------------- */
  function diagnose() {
    refreshVoices();
    const hasZh = voicesCache.some((v) => (v.lang || '').toLowerCase().indexOf('zh') === 0);
    const hasEn = voicesCache.some((v) => (v.lang || '').toLowerCase().indexOf('en') === 0);
    return {
      ttsSupported: ttsReady,
      audioApi: !!(window.AudioContext || window.webkitAudioContext),
      voiceCount: voicesCache.length,
      hasZhVoice: hasZh,
      hasEnVoice: hasEn,
      voices: voicesCache.slice(0, 10).map((v) => v.name + ' (' + v.lang + (v.localService ? '·本地' : '·网络') + ')')
    };
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
    beep: beep,
    diagnose: diagnose,
    recognize: recognize,
    recognizeBrowser: recognizeBrowser,
    recognizeProxy: recognizeProxy,
    normalize: normalize,
    matchScore: matchScore,
    hasRecognition: hasRecognition,
    ttsReady: ttsReady,
    setProvider: setProvider,
    config: config,
    get lastTtsError() { return lastTtsError; }
  };
})();

if (typeof window !== 'undefined') window.Voice = Voice;
