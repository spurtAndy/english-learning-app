/* ============================================================
 * 主程序：路由 + 闯关流程 + 四种玩法
 * 视图层级：首页(年级) → 单元 → 关卡阶段(学一学/跟我读/听音选词/闯关测验)
 * 数据来自 data.js(CURRICULUM)，语音来自 voice.js(Voice)，进度来自 storage.js(Store)
 * ============================================================ */
(function () {
  'use strict';

  const app = document.getElementById('app');
  const overlay = document.getElementById('overlay');
  const state = { view: 'home', sj: 0, gi: 0, ui: 0, si: 0 };
  let current = null; // 当前关卡的控制器 { handle(act, el) }

  /* ----------------------- 工具 ----------------------- */
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function el(id) { return document.getElementById(id); }

  /* ----------------------- 解锁逻辑 ----------------------- */
  function subjectAt(i) { return CURRICULUM.subjects[i]; }
  function gradeAt(i) { return CURRICULUM.subjects[state.sj].grades[i]; }
  function currentLang() { return CURRICULUM.subjects[state.sj].lang || 'en'; }
  function unitComplete(g, u) { return u.stages.every((s, si) => Store.getStage(g.id, u.id, si) > 0); }
  function gradeComplete(g) { return g.units.length > 0 && g.units.every((u) => unitComplete(g, u)); }
  function gradeUnlocked(i) {
    if (i === 0) return true;
    const pg = gradeAt(i - 1);
    if (pg.soon) return false;
    return gradeComplete(pg);
  }
  function unitUnlocked(g, ui) { if (ui === 0) return true; return unitComplete(g, g.units[ui - 1]); }
  function stageUnlocked(g, u, si) { if (si === 0) return true; return Store.getStage(g.id, u.id, si - 1) > 0; }
  function gradeStars(g) { let s = 0; g.units.forEach((u) => u.stages.forEach((st, si) => s += Store.getStage(g.id, u.id, si))); return s; }

  /* ----------------------- 顶部栏 ----------------------- */
  function topbar(opts) {
    opts = opts || {};
    return '' +
      '<div class="topbar">' +
        (opts.back ? '<button class="btn-back" data-act="back">← 返回</button>' : '<span class="btn-back ghost"></span>') +
        '<div class="title">' + (opts.title || '快乐学英语') + '</div>' +
        '<div class="stars-top">⭐ ' + Store.totalStars() + '</div>' +
      '</div>';
  }

  /* ----------------------- 视图：首页 ----------------------- */
  function renderHome() {
    let html = topbar({ title: '快乐学 · 闯关学堂 🎒' });
    html += '<div class="section home">';
    html += '<p class="subtitle">选择学科，开始闯关吧！</p>';
    html += '<div class="subject-grid">';
    CURRICULUM.subjects.forEach((sub, i) => {
      html += '<button class="subject-card" data-act="open-subject" data-sj="' + i + '">';
      html += '<div class="subject-emoji">' + sub.emoji + '</div>';
      html += '<div class="subject-name">' + sub.name + '</div>';
      html += '<div class="subject-sub">' + sub.subtitle + '</div>';
      html += '</button>';
    });
    html += '</div>';
    html += '<div class="home-foot"><button class="btn-mini" data-act="reset">🔄 重置进度</button></div>';
    if (!Voice.hasRecognition) {
      html += '<p class="hint-small center">提示：当前浏览器不支持自动语音评分，跟我读将变为「自检跟读」模式（家长陪孩子确认发音）。推荐使用 Chrome / Edge。</p>';
    }
    html += '</div>';
    app.innerHTML = html;
  }

  /* ----------------------- 视图：年级(单元) ----------------------- */
  function renderGrade() {
    const g = gradeAt(state.gi);
    const sub = subjectAt(state.sj);
    let html = topbar({ title: sub.name + ' · ' + g.emoji + ' ' + g.name, back: true });
    html += '<div class="section"><p class="subtitle">' + sub.name + ' · 完成本单元 4 个关卡，解锁下一单元</p><div class="unit-grid">';
    g.units.forEach((u, ui) => {
      const unlocked = unitUnlocked(g, ui);
      html += '<button class="unit-card' + (unlocked ? '' : ' locked') + '" data-act="open-unit" data-ui="' + ui + '"' + (unlocked ? '' : ' disabled') + '>';
      html += '<div class="unit-emoji">' + u.emoji + '</div>';
      html += '<div class="unit-name">' + u.name + '</div>';
      html += '<div class="stage-dots">';
      u.stages.forEach((st, si) => {
        const s = Store.getStage(g.id, u.id, si);
        html += '<span class="dot' + (s > 0 ? ' on' : '') + '">' + (s > 0 ? '★'.repeat(s) : '☆') + '</span>';
      });
      html += '</div>';
      if (!unlocked) html += '<div class="grade-tag">🔒</div>';
      html += '</button>';
    });
    html += '</div></div>';
    app.innerHTML = html;
  }

  /* ----------------------- 视图：单元(关卡阶段) ----------------------- */
  function renderUnit() {
    const g = gradeAt(state.gi);
    const u = g.units[state.ui];
    let html = topbar({ title: u.emoji + ' ' + u.name, back: true });
    html += '<div class="section"><div class="stage-list">';
    u.stages.forEach((st, si) => {
      const unlocked = stageUnlocked(g, u, si);
      const s = Store.getStage(g.id, u.id, si);
      html += '<button class="stage-card' + (unlocked ? '' : ' locked') + '" data-act="open-stage" data-si="' + si + '"' + (unlocked ? '' : ' disabled') + '>';
      html += '<div class="stage-icon">' + st.icon + '</div>';
      html += '<div class="stage-title">' + st.title + '</div>';
      html += '<div class="stage-stars">' + (s > 0 ? '★'.repeat(s) : (unlocked ? '未通关' : '🔒')) + '</div>';
      html += '</button>';
    });
    html += '</div></div>';
    app.innerHTML = html;
  }

  /* ----------------------- 视图：关卡分发 ----------------------- */
  function renderStage() {
    const g = gradeAt(state.gi);
    const u = g.units[state.ui];
    const st = u.stages[state.si];
    if (st.type === 'learn') renderLearn(g, u);
    else if (st.type === 'speak') renderSpeak(g, u);
    else if (st.type === 'listen') renderListen(g, u);
    else if (st.type === 'quiz') renderQuiz(g, u);
  }

  /* ----------------------- 玩法1：学一学（卡片：英文/拼音 ↔ 中文/汉字） ----------------------- */
  function renderLearn(g, u) {
    let idx = 0, flipped = false;
    const isZh = currentLang() === 'zh';
    function draw() {
      const w = u.words[idx];
      const frontMain = isZh ? w.py : w.en;
      const frontHint = isZh ? '👆 点击卡片看汉字' : '👆 点击卡片看中文';
      const backMain = isZh ? w.zh : w.zh;
      const backSub = isZh ? w.py : w.en;
      let html = topbar({ title: u.emoji + ' 学一学', back: true });
      html += '<div class="stage-wrap"><div class="flashcard' + (flipped ? ' flipped' : '') + '" data-act="flip">';
      html += '<div class="fc-front"><div class="fc-emoji">' + w.emoji + '</div><div class="fc-en' + (isZh ? ' fc-py' : '') + '">' + frontMain + '</div><div class="fc-hint">' + frontHint + '</div></div>';
      html += '<div class="fc-back"><div class="fc-zh">' + backMain + '</div><div class="fc-en">' + backSub + '</div><div class="fc-emoji">' + w.emoji + '</div></div>';
      html += '</div>';
      html += '<div class="row">';
      html += '<button class="btn-primary" data-act="play-word">🔊 听一读</button>';
      html += '<button class="btn-ghost" data-act="prev-w">← 上一个</button>';
      html += '<button class="btn-ghost" data-act="next-w">下一个 →</button>';
      html += '</div>';
      html += '<div class="progress">第 ' + (idx + 1) + ' / ' + u.words.length + ' 个</div>';
      if (idx === u.words.length - 1) html += '<button class="btn-big" data-act="finish-learn">✅ 学习完成</button>';
      html += '</div>';
      app.innerHTML = html;
    }
    current = {
      handle: function (act) {
        if (act === 'flip') { flipped = !flipped; draw(); }
        else if (act === 'play-word') { const ww = u.words[idx]; Voice.speak(isZh ? ww.zh : ww.en, { lang: isZh ? 'zh-CN' : 'en-US' }); }
        else if (act === 'prev-w') { idx = Math.max(0, idx - 1); flipped = false; draw(); }
        else if (act === 'next-w') { idx = Math.min(u.words.length - 1, idx + 1); flipped = false; draw(); }
        else if (act === 'finish-learn') { completeStage(g, u, state.si, 1); }
      }
    };
    draw();
  }

  /* ----------------------- 玩法2：跟我读（语音跟读） ----------------------- */
  function renderSpeak(g, u) {
    const isZh = currentLang() === 'zh';
    const items = [];
    u.words.forEach((w) => items.push({ text: isZh ? w.zh : w.en, py: w.py, zh: w.zh, emoji: w.emoji, type: 'word' }));
    (u.sentences || []).forEach((s) => items.push({ text: s, type: 'sentence' }));
    const fallback = !Voice.hasRecognition;
    let idx = 0, correct = 0, attempted = false, listening = false;

    function feedback(msg, ok) {
      const fb = el('sp-fb');
      if (fb) { fb.textContent = msg; fb.className = 'speak-feedback ' + (ok ? 'ok' : 'no'); }
    }
    function draw() {
      const it = items[idx];
      let html = topbar({ title: u.emoji + ' 跟我读', back: true });
      html += '<div class="stage-wrap speak">';
      html += '<div class="speak-card">';
      html += '<div class="speak-emoji">' + (it.emoji || '🎤') + '</div>';
      html += '<div class="speak-text' + (isZh ? ' fc-py' : '') + '">' + (isZh ? it.py : it.text) + '</div>';
      if (it.zh) html += '<div class="speak-zh">' + it.zh + '</div>';
      html += '<div class="speak-type">' + (it.type === 'sentence' ? '📝 句子跟读' : (isZh ? '🔤 拼音跟读' : '🔤 单词跟读')) + '</div>';
      html += '</div>';
      html += '<div class="row">';
      html += '<button class="btn-primary" data-act="listen-item">🔊 听一读</button>';
      if (fallback) {
        html += '<button class="btn-mic" data-act="self-ok">✅ 我读好了</button>';
      } else {
        html += '<button class="btn-mic' + (listening ? ' active' : '') + '" data-act="speak-item"' + (listening ? ' disabled' : '') + '>' + (listening ? '🎙️ 听你说…' : '🎤 开始跟读') + '</button>';
      }
      html += '</div>';
      html += '<div class="speak-feedback" id="sp-fb"></div>';
      html += '<div class="progress">第 ' + (idx + 1) + ' / ' + items.length + '</div>';
      if (attempted) {
        const last = idx === items.length - 1;
        html += '<button class="btn-big" data-act="next-item">' + (last ? '🎉 完成跟读' : '下一个 →') + '</button>';
      }
      if (fallback) html += '<p class="hint-small">本设备不支持自动语音评分，请家长陪孩子自检发音。</p>';
      html += '</div>';
      app.innerHTML = html;
    }
    current = {
      handle: function (act) {
        const it = items[idx];
        if (act === 'listen-item') { Voice.speak(it.text, { lang: isZh ? 'zh-CN' : 'en-US' }); }
        else if (act === 'self-ok') { attempted = true; correct++; draw(); }
        else if (act === 'speak-item') {
          if (listening) return;
          listening = true; draw();
          Voice.recognize(isZh ? 'zh-CN' : 'en-US').then(function (r) {
            listening = false; attempted = true;
            let ok = false, msg = '';
            if (r.success) {
              const best = r.alternatives[0];
              const sc = Voice.matchScore(best, it.text);
              ok = sc >= 0.6; if (ok) correct++;
              msg = (ok ? '🌟 读得真棒！听到：' : '🤔 再试试～听到：') + best;
            } else {
              msg = '没听清，再读一次吧～'; attempted = false;
            }
            draw();
            setTimeout(function () { feedback(msg, ok && r.success); }, 10);
          });
        }
        else if (act === 'next-item') {
          if (idx < items.length - 1) { idx++; attempted = false; draw(); }
          else {
            let stars = items.length ? Math.round((correct / items.length) * 3) : 1;
            stars = Math.max(1, Math.min(3, stars));
            completeStage(g, u, state.si, stars);
          }
        }
      }
    };
    draw();
  }

  /* ----------------------- 玩法3：听音选词 / 听音选拼音 ----------------------- */
  function renderListen(g, u) {
    const isZh = currentLang() === 'zh';
    const KEY = isZh ? 'py' : 'en';
    const words = u.words;
    let idx = 0, correct = 0, picked = false, lastPick = '', options = [];
    function buildOptions() {
      const target = words[idx];
      const pool = shuffle(words.filter((w) => w[KEY] !== target[KEY]).map((w) => w[KEY])).slice(0, 3);
      options = shuffle([target[KEY]].concat(pool));
    }
    function draw() {
      const w = words[idx];
      let html = topbar({ title: u.emoji + ' 听音选词', back: true });
      html += '<div class="stage-wrap listen">';
      html += '<button class="big-play" data-act="play-sound">' + (isZh ? '🔊 听发音，选出正确的拼音' : '🔊 点击听发音，选出单词') + '</button>';
      html += '<div class="opt-grid">';
      options.forEach((opt) => {
        let cls = 'opt';
        if (picked) { if (opt === w[KEY]) cls += ' correct'; else if (opt === lastPick) cls += ' wrong'; }
        html += '<button class="' + cls + (isZh ? ' fc-py' : '') + '" data-act="pick" data-opt="' + opt + '"' + (picked ? ' disabled' : '') + '>' + opt + '</button>';
      });
      html += '</div>';
      html += '<div class="progress">第 ' + (idx + 1) + ' / ' + words.length + '</div>';
      if (picked) {
        const last = idx === words.length - 1;
        html += '<button class="btn-big" data-act="next-listen">' + (last ? '🎉 完成' : '下一题 →') + '</button>';
      }
      html += '</div>';
      app.innerHTML = html;
    }
    current = {
      handle: function (act, target) {
        const w = words[idx];
        if (act === 'play-sound') { Voice.speak(isZh ? w.zh : w.en, { lang: isZh ? 'zh-CN' : 'en-US' }); }
        else if (act === 'pick') {
          if (picked) return;
          picked = true; lastPick = target.getAttribute('data-opt');
          if (lastPick === w[KEY]) correct++;
          draw();
        }
        else if (act === 'next-listen') {
          if (idx < words.length - 1) { idx++; picked = false; buildOptions(); draw(); }
          else { finishStage(g, u, state.si, correct / words.length); }
        }
      }
    };
    buildOptions(); draw();
  }

  /* ----------------------- 玩法4：闯关测验（选中文意思 / 选拼音） ----------------------- */
  function renderQuiz(g, u) {
    const isZh = currentLang() === 'zh';
    const KEY = isZh ? 'py' : 'zh';
    const words = u.words;
    let idx = 0, correct = 0, picked = false, lastPick = '', options = [];
    function buildOptions() {
      const target = words[idx];
      const pool = shuffle(words.filter((w) => w[KEY] !== target[KEY]).map((w) => w[KEY])).slice(0, 3);
      options = shuffle([target[KEY]].concat(pool));
    }
    function draw() {
      const w = words[idx];
      let html = topbar({ title: u.emoji + ' 闯关测验', back: true });
      html += '<div class="stage-wrap quiz">';
      html += '<div class="quiz-word"><div class="quiz-emoji">' + w.emoji + '</div><div class="quiz-en' + (isZh ? ' fc-py' : '') + '">' + (isZh ? w.zh : w.en) + '</div></div>';
      html += '<p class="quiz-q">' + (isZh ? '选出它的拼音：' : '选出它的中文意思：') + '</p>';
      html += '<div class="opt-grid">';
      options.forEach((opt) => {
        let cls = 'opt';
        if (picked) { if (opt === w[KEY]) cls += ' correct'; else if (opt === lastPick) cls += ' wrong'; }
        html += '<button class="' + cls + (isZh ? ' fc-py' : '') + '" data-act="pick-zh" data-opt="' + opt + '"' + (picked ? ' disabled' : '') + '>' + opt + '</button>';
      });
      html += '</div>';
      html += '<div class="progress">第 ' + (idx + 1) + ' / ' + words.length + '</div>';
      if (picked) {
        const last = idx === words.length - 1;
        html += '<button class="btn-big" data-act="next-quiz">' + (last ? '🎉 完成' : '下一题 →') + '</button>';
      }
      html += '</div>';
      app.innerHTML = html;
    }
    current = {
      handle: function (act, target) {
        const w = words[idx];
        if (act === 'pick-zh') {
          if (picked) return;
          picked = true; lastPick = target.getAttribute('data-opt');
          if (lastPick === w[KEY]) correct++;
          draw();
        }
        else if (act === 'next-quiz') {
          if (idx < words.length - 1) { idx++; picked = false; buildOptions(); draw(); }
          else { finishStage(g, u, state.si, correct / words.length); }
        }
      }
    };
    buildOptions(); draw();
  }

  /* ----------------------- 通关 / 星级 / 重试 ----------------------- */
  function computeStars(ratio) { return ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.5 ? 1 : 0; }
  function completeStage(g, u, si, stars) {
    Store.setStage(g.id, u.id, si, stars);
    showCelebrate(stars);
  }
  function finishStage(g, u, si, ratio) {
    const stars = computeStars(ratio);
    if (stars <= 0) showRetry();
    else completeStage(g, u, si, stars);
  }

  /* ----------------------- 弹窗 ----------------------- */
  function showOverlay(htmlStr) { overlay.innerHTML = '<div class="modal">' + htmlStr + '</div>'; overlay.classList.add('show'); }
  function hideOverlay() { overlay.classList.remove('show'); overlay.innerHTML = ''; }

  function showCelebrate(stars) {
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    showOverlay(
      '<div class="modal-emoji">🎉</div>' +
      '<div class="modal-title">过关啦！</div>' +
      '<div class="modal-stars">' + starStr + '</div>' +
      '<div class="modal-btns">' +
        '<button class="btn-primary" data-act="celebrate-continue">继续闯关 →</button>' +
        '<button class="btn-ghost" data-act="celebrate-replay">再玩一次</button>' +
      '</div>'
    );
  }
  function showRetry() {
    showOverlay(
      '<div class="modal-emoji">💪</div>' +
      '<div class="modal-title">差一点点！</div>' +
      '<div class="modal-sub">答对一半以上才能过关哦</div>' +
      '<div class="modal-btns">' +
        '<button class="btn-primary" data-act="retry-retry">再试一次</button>' +
        '<button class="btn-ghost" data-act="retry-back">返回单元</button>' +
      '</div>'
    );
  }
  function doReset() {
    showOverlay(
      '<div class="modal-emoji">⚠️</div>' +
      '<div class="modal-title">重置所有进度？</div>' +
      '<div class="modal-sub">已获得的星星会全部清空</div>' +
      '<div class="modal-btns">' +
        '<button class="btn-primary" data-act="reset-confirm">确认重置</button>' +
        '<button class="btn-ghost" data-act="reset-cancel">取消</button>' +
      '</div>'
    );
  }

  /* ----------------------- 导航 ----------------------- */
  function goHome() { state.view = 'home'; renderHome(); }
  function goGrade() { state.view = 'grade'; renderGrade(); }
  function goUnit() { state.view = 'unit'; renderUnit(); }
  function goStage() { state.view = 'stage'; current = null; renderStage(); }
  function goBack() {
    if (state.view === 'stage') goUnit();
    else if (state.view === 'unit') goGrade();
    else if (state.view === 'grade') goHome();
  }

  /* ----------------------- 事件委托 ----------------------- */
  app.addEventListener('click', function (e) {
    const node = e.target.closest('[data-act]');
    if (!node) return;
    const act = node.getAttribute('data-act');
    if (act === 'back') { goBack(); return; }
    if (act === 'open-subject') { state.sj = +node.dataset.sj; goGrade(); return; }
    if (act === 'open-grade') { state.gi = +node.dataset.gi; goGrade(); return; }
    if (act === 'open-unit') { state.ui = +node.dataset.ui; goUnit(); return; }
    if (act === 'open-stage') { state.si = +node.dataset.si; goStage(); return; }
    if (act === 'reset') { doReset(); return; }
    if (current && current.handle) current.handle(act, node);
  });

  overlay.addEventListener('click', function (e) {
    const node = e.target.closest('[data-act]');
    if (!node) return;
    const act = node.getAttribute('data-act');
    if (act === 'celebrate-continue') { hideOverlay(); goUnit(); }
    else if (act === 'celebrate-replay') { hideOverlay(); goStage(); }
    else if (act === 'retry-retry') { hideOverlay(); goStage(); }
    else if (act === 'retry-back') { hideOverlay(); goUnit(); }
    else if (act === 'reset-confirm') { Store.resetAll(); hideOverlay(); goHome(); }
    else if (act === 'reset-cancel') { hideOverlay(); }
  });

  /* ----------------------- 启动 ----------------------- */
  function init() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () { /* 离线缓存失败不影响使用 */ });
      });
    }
    renderHome();
  }
  init();
})();
