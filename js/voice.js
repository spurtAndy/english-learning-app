/* ============================================================
 * 语音模块：封装浏览器原生 Web Speech API
 *  - speak()     文本朗读（TTS，speechSynthesis）
 *  - recognize() 语音识别（SpeechRecognition）
 *  - normalize() 归一化比对
 *  - available   是否支持语音识别（不支持时 UI 自动降级）
 * 依赖：现代浏览器（Chrome / Edge 体验最佳；安卓平板 Chrome 完美支持；
 *       iPad Safari 识别能力有限，会自动走“自检跟读”降级模式）
 * ============================================================ */

const Voice = (function () {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const hasRecognition = !!SR;
  let ttsReady = 'speechSynthesis' in window;

  // 部分浏览器需要等 voices 加载完才能正常朗读
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

  // 语音识别：返回 { success, alternatives:[...], error }
  function recognize(lang, timeout) {
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

      // 超时保护
      setTimeout(function () {
        if (!done) { try { rec.stop(); } catch (e) {} finish({ success: false, error: 'timeout' }); }
      }, timeout);
    });
  }

  // 归一化：转小写、去标点、压缩空格
  function normalize(s) {
    return (s || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // 比对得分 0~1：单词看是否包含；短句看词重叠率
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
    normalize: normalize,
    matchScore: matchScore,
    hasRecognition: hasRecognition,
    ttsReady: ttsReady
  };
})();

if (typeof window !== 'undefined') window.Voice = Voice;
