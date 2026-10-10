/* ============================================================
 * 主程序：路由 + 闯关流程 + 四种玩法 + 错词复习 + 家长看板
 * 视图层级：首页(学科) → 年级(单元) → 单元(关卡) → 关卡阶段
 * 数据来自 data.js(CURRICULUM)，语音来自 voice.js(Voice)，进度来自 storage.js(Store)
 * ============================================================ */
(function () {
  'use strict';

  const app = document.getElementById('app');
  const overlay = document.getElementById('overlay');
  const state = { view: 'home', sj: 0, gi: 0, ui: 0, si: 0, manage: false };
  let current = null; // 当前关卡的控制器 { handle(act, el) }
  let reviewIdx = 0;  // 复习模式当前索引

  /* ----------------------- 工具 ----------------------- */
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function el(id) { return document.getElementById(id); }
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ----------------------- 解锁逻辑 ----------------------- */
  function subjectAt(i) { return CURRICULUM.subjects[i]; }
  function gradeAt(i) { return CURRICULUM.subjects[state.sj].grades[i]; }
  function currentLang() { return CURRICULUM.subjects[state.sj].lang || 'en'; }
  function unitComplete(g, u) { return u.stages.every((s, si) => Store.getStage(g.id, u.id, si) > 0); }
  function gradeComplete(g) { return g.units.length > 0 && g.units.every((u) => unitComplete(g, u)); }
  // 全部关卡直接可挑战，不再逐级解锁（每课、每关都能点开就玩）
  function gradeUnlocked(i) { return true; }
  function unitUnlocked(g, ui) { return true; }
  function stageUnlocked(g, u, si) { return true; }
  function gradeStars(g) { let s = 0; g.units.forEach((u) => u.stages.forEach((st, si) => s += Store.getStage(g.id, u.id, si))); return s; }

  // 记录答错的词（用于错词本 / 复习模式）
  function recordWrongWord(g, u, w) {
    const isZh = currentLang() === 'zh';
    Store.recordWrong({
      subjectId: CURRICULUM.subjects[state.sj].id,
      gradeId: g.id, unitId: u.id,
      en: w.en || '', zh: w.zh || '', py: w.py || '', emoji: w.emoji || '🔤'
    });
    // 若切到 proxy 语音打分后，可在此接“弱项分析”，当前仅记录
    void isZh;
  }

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
    // 多用户：切换 / 添加 / 管理儿童档案
    const profiles = Store.listProfiles();
    html += '<div class="profiles">';
    profiles.forEach(function (p) {
      html += '<button class="profile-chip' + (p.current ? ' active' : '') + '" data-act="switch-profile" data-id="' + p.id + '">' + escapeHtml(p.name) + '</button>';
    });
    html += '<button class="profile-chip add" data-act="add-profile">＋ 添加用户</button>';
    html += '<button class="profile-chip manage" data-act="toggle-manage">' + (state.manage ? '✅ 完成' : '⚙ 管理') + '</button>';
    html += '</div>';
    if (state.manage) {
      html += '<div class="profile-manage">';
      profiles.forEach(function (p) {
        html += '<div class="pm-row"><span class="pm-name">' + escapeHtml(p.name) + (p.current ? '（当前）' : '') + '</span>' +
          '<button class="btn-mini" data-act="rename-profile" data-id="' + p.id + '">✎ 改名</button>' +
          '<button class="btn-mini danger" data-act="delete-profile" data-id="' + p.id + '">🗑 删除</button></div>';
      });
      html += '<p class="hint-small">删除档案会同时清除该用户的学习进度，且至少保留 1 个用户。</p>';
      html += '</div>';
    }
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
    html += '<div class="home-tools">';
    html += '<button class="tool-card" data-act="open-review"><div class="tool-emoji">🔁</div><div class="tool-name">错词复习</div><div class="tool-sub">复习 ' + Store.wrongCount() + ' 个错词</div></button>';
    html += '<button class="tool-card" data-act="open-dashboard"><div class="tool-emoji">📊</div><div class="tool-name">家长看板</div><div class="tool-sub">查看学习进度</div></button>';
    html += '<button class="tool-card" data-act="open-soundtest"><div class="tool-emoji">🔊</div><div class="tool-name">声音测试</div><div class="tool-sub">没声音？点这里诊断</div></button>';
    html += '</div>';
    html += '<div class="home-foot"><button class="btn-mini" data-act="reset">🔄 重置进度</button></div>';
    if (!Voice.hasRecognition && Voice.config.provider !== 'proxy') {
      html += '<p class="hint-small center">提示：当前浏览器不支持自动语音评分，跟我读将变为「自检跟读」模式（家长陪孩子确认发音）。推荐 Chrome / Edge；国内可用「后端语音识别」真正打分。</p>';
    }
    html += '</div>';
    app.innerHTML = html;
  }

  /* ----------------------- 视图：年级选择 ----------------------- */
  function doneUnitsCount(g) {
    let n = 0; g.units.forEach((u) => { if (unitComplete(g, u)) n++; }); return n;
  }
  function renderGrades() {
    const sub = subjectAt(state.sj);
    let html = topbar({ title: sub.emoji + ' ' + sub.name + ' · 选年级', back: true });
    html += '<div class="section"><p class="subtitle">选择一个年级，所有课程可直接挑战</p><div class="grade-grid">';
    sub.grades.forEach((g, i) => {
      html += '<button class="grade-card" data-act="open-grade" data-gi="' + i + '">';
      html += '<div class="grade-emoji">' + g.emoji + '</div>';
      html += '<div class="grade-name">' + g.name + '</div>';
      html += '<div class="grade-tag">⭐ ' + gradeStars(g) + ' · 已学 ' + doneUnitsCount(g) + '/' + g.units.length + ' 课</div>';
      html += '</button>';
    });
    html += '</div></div>';
    app.innerHTML = html;
  }

  /* ----------------------- 视图：单元(课程) ----------------------- */
  function renderUnits() {
    const g = gradeAt(state.gi);
    const sub = subjectAt(state.sj);
    let html = topbar({ title: sub.name + ' · ' + g.emoji + ' ' + g.name, back: true });
    html += '<div class="section"><p class="subtitle">每一课都能直接挑战，收集 ⭐ 越多越棒</p><div class="unit-grid">';
    g.units.forEach((u, ui) => {
      html += '<button class="unit-card" data-act="open-unit" data-ui="' + ui + '">';
      html += '<div class="unit-emoji">' + u.emoji + '</div>';
      html += '<div class="unit-name">' + u.name + '</div>';
      html += '<div class="stage-dots">';
      u.stages.forEach((st, si) => {
        const s = Store.getStage(g.id, u.id, si);
        html += '<span class="dot' + (s > 0 ? ' on' : '') + '">' + (s > 0 ? '★'.repeat(s) : '☆') + '</span>';
      });
      html += '</div>';
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
    const fallback = !Voice.hasRecognition && Voice.config.provider !== 'proxy';
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
          if (lastPick === w[KEY]) { correct++; Voice.beep('correct'); }
          else { recordWrongWord(g, u, w); Voice.beep('wrong'); }
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
          if (lastPick === w[KEY]) { correct++; Voice.beep('correct'); }
          else { recordWrongWord(g, u, w); Voice.beep('wrong'); }
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

  /* ----------------------- 错词复习模式 ----------------------- */
  function renderReview() {
    const list = Store.getWrongList();
    if (list.length === 0) {
      let html = topbar({ title: '🔁 错词复习', back: true });
      html += '<div class="section center-box"><div class="big-emoji">🎉</div><p class="subtitle">还没有错词，继续加油！</p><button class="btn-big" data-act="back">返回首页</button></div>';
      app.innerHTML = html; return;
    }
    if (reviewIdx >= list.length) reviewIdx = list.length - 1;
    if (reviewIdx < 0) reviewIdx = 0;
    const it = list[reviewIdx];
    const isZh = !!(it.py && !it.en);
    let html = topbar({ title: '🔁 错词复习', back: true });
    html += '<div class="section review">';
    html += '<div class="flashcard show"><div class="fc-front"><div class="fc-emoji">' + it.emoji + '</div>' +
            '<div class="fc-en' + (isZh ? ' fc-py' : '') + '">' + (isZh ? it.py : it.en) + '</div>' +
            '<div class="fc-hint">答案在下方 👇</div></div></div>';
    html += '<div class="review-answer">答案：' + (it.zh || '') + (isZh ? '' : '（' + (it.py || '') + '）') + '</div>';
    html += '<div class="review-meta">答错次数：' + (it.count || 1) + '</div>';
    html += '<div class="row">';
    html += '<button class="btn-primary" data-act="review-play">🔊 听一读</button>';
    html += '<button class="btn-mic" data-act="review-master">✅ 已掌握</button>';
    html += '</div>';
    html += '<div class="progress">第 ' + (reviewIdx + 1) + ' / ' + list.length + ' 个错词</div>';
    html += '<button class="btn-mini" data-act="review-clear">🗑️ 清空错词本</button>';
    html += '</div>';
    app.innerHTML = html;
  }

  /* ----------------------- 家长看板 ----------------------- */
  function renderDashboard() {
    let totalUnits = 0, doneUnits = 0;
    CURRICULUM.subjects.forEach(function (sub) {
      sub.grades.forEach(function (g) {
        g.units.forEach(function (u) { totalUnits++; if (unitComplete(g, u)) doneUnits++; });
      });
    });
    let html = topbar({ title: '📊 家长看板 · ' + escapeHtml(Store.currentProfile().name), back: true });
    html += '<div class="section dashboard">';
    html += '<div class="dash-cards">';
    html += '<div class="dash-card"><div class="dash-num">' + Store.totalStars() + '</div><div class="dash-label">⭐ 总星数</div></div>';
    html += '<div class="dash-card"><div class="dash-num">' + Store.wrongCount() + '</div><div class="dash-label">🔁 错词数</div></div>';
    html += '<div class="dash-card"><div class="dash-num">' + doneUnits + '/' + totalUnits + '</div><div class="dash-label">🏁 通关单元</div></div>';
    html += '</div>';
    CURRICULUM.subjects.forEach(function (sub) {
      html += '<div class="dash-sub"><h3>' + sub.emoji + ' ' + sub.name + '</h3>';
      sub.grades.forEach(function (g) {
        const tot = g.units.length;
        const done = g.units.filter(function (u) { return unitComplete(g, u); }).length;
        const pct = tot ? Math.round(done / tot * 100) : 0;
        html += '<div class="dash-row"><span>' + g.emoji + ' ' + g.name + '</span><span>' + pct + '% · ⭐' + gradeStars(g) + '</span></div>';
      });
      html += '</div>';
    });
    html += '<button class="btn-mini" data-act="back">返回首页</button>';
    html += '</div>';
    app.innerHTML = html;
  }

  /* ----------------------- 声音测试 / 诊断 ----------------------- */
  function soundAdvice(d) {
    const tips = [];
    if (!d.ttsSupported) tips.push('此浏览器不支持语音合成（TTS），请改用 Chrome / Edge。');
    if (!d.audioApi) tips.push('此浏览器不支持 WebAudio，提示音不可用。');
    if (d.voiceCount === 0) tips.push('手机上没有任何发音人：请到系统设置搜索「文字转语音 / TTS」，选择并安装一个语音引擎（安卓可在应用商店装「Google 文字转语音」或用系统自带引擎）。');
    if (d.voiceCount > 0 && !d.hasEnVoice) tips.push('当前发音人里没有英语语音包：英语朗读可能无声，请在 TTS 引擎里下载英文语音数据，或换用带英文的引擎。');
    if (d.voiceCount > 0 && !d.hasZhVoice) tips.push('当前发音人里没有中文语音包：中文/拼音朗读可能无声，请在 TTS 引擎里下载中文语音数据。');
    tips.push('若第 1 步（提示音）都没声：是音量/静音问题——调大「媒体音量」（不是铃声音量）；iPhone 请关闭侧边静音拨片。');
    tips.push('若第 1 步有声、2/3 无声：是系统语音引擎缺对应语言，按上面提示安装语音包。');
    return tips.map((t) => '<p class="hint-small">· ' + escapeHtml(t) + '</p>').join('');
  }
  function renderSoundTest() {
    const d = Voice.diagnose();
    let html = topbar({ title: '🔊 声音测试', back: true });
    html += '<div class="section soundtest">';
    html += '<p class="subtitle">从上到下依次点：哪一步没声音，问题就出在那一步</p>';
    html += '<button class="stage-card" data-act="test-beep"><div class="stage-icon">🔔</div><div class="stage-title">第 1 步 · 提示音（不依赖语音引擎）</div><div class="stage-stars" id="st-beep"></div></button>';
    html += '<button class="stage-card" data-act="test-zh"><div class="stage-icon">🀄</div><div class="stage-title">第 2 步 · 中文朗读「你好」</div><div class="stage-stars" id="st-zh"></div></button>';
    html += '<button class="stage-card" data-act="test-en"><div class="stage-icon">🅰️</div><div class="stage-title">第 3 步 · 英文朗读「one two three」</div><div class="stage-stars" id="st-en"></div></button>';
    html += '<div class="soundtest-info">';
    html += '<p class="hint-small">引擎状态：TTS ' + (d.ttsSupported ? '✅ 支持' : '❌ 不支持') + ' · 音频通道 ' + (d.audioApi ? '✅' : '❌') + ' · 发音人 ' + d.voiceCount + ' 个</p>';
    if (d.voices.length) html += '<p class="hint-small">' + d.voices.map(escapeHtml).join('；') + '</p>';
    html += '<div class="soundtest-advice">' + soundAdvice(d) + '</div>';
    html += '</div></div>';
    app.innerHTML = html;
  }
  function setTestResult(id, msg, ok) {
    const n = el(id);
    if (n) { n.textContent = msg; n.className = 'stage-stars ' + (ok ? 'ok' : 'no'); }
  }

  /* ----------------------- 通关 / 星级 / 重试 ----------------------- */
  function computeStars(ratio) { return ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.5 ? 1 : 0; }
  function completeStage(g, u, si, stars) {
    Store.setStage(g.id, u.id, si, stars);
    Voice.beep('win');
    showCelebrate(stars);
  }
  function finishStage(g, u, si, ratio) {
    const stars = computeStars(ratio);
    if (stars <= 0) { Voice.beep('wrong'); showRetry(); }
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
      '<div class="modal-sub">已获得的星星会全部清空（错词本保留）</div>' +
      '<div class="modal-btns">' +
        '<button class="btn-primary" data-act="reset-confirm">确认重置</button>' +
        '<button class="btn-ghost" data-act="reset-cancel">取消</button>' +
      '</div>'
    );
  }

  /* ----------------------- 导航 ----------------------- */
  function goHome() { state.view = 'home'; renderHome(); }
  function goGrades() { state.view = 'grades'; renderGrades(); }
  function goUnits() { state.view = 'units'; renderUnits(); }
  function goUnit() { state.view = 'unit'; renderUnit(); }
  function goStage() { state.view = 'stage'; current = null; renderStage(); }
  function goReview() { state.view = 'review'; reviewIdx = 0; renderReview(); }
  function goDashboard() { state.view = 'dashboard'; renderDashboard(); }
  function goSoundTest() { state.view = 'soundtest'; renderSoundTest(); }
  function goBack() {
    if (state.view === 'stage') goUnit();
    else if (state.view === 'unit') goUnits();
    else if (state.view === 'units') goGrades();
    else if (state.view === 'grades') goHome();
    else if (state.view === 'review' || state.view === 'dashboard' || state.view === 'soundtest') goHome();
  }

  /* ----------------------- 事件委托 ----------------------- */
  app.addEventListener('click', function (e) {
    const node = e.target.closest('[data-act]');
    if (!node) return;
    const act = node.getAttribute('data-act');
    if (act === 'back') { goBack(); return; }
    if (act === 'open-subject') { state.sj = +node.dataset.sj; goGrades(); return; }
    if (act === 'open-grade') { state.gi = +node.dataset.gi; goUnits(); return; }
    if (act === 'open-unit') { state.ui = +node.dataset.ui; goUnit(); return; }
    if (act === 'open-stage') { state.si = +node.dataset.si; goStage(); return; }
    if (act === 'open-soundtest') { goSoundTest(); return; }
    if (act === 'test-beep') {
      Voice.beep('click');
      setTestResult('st-beep', '🔔 已播放（没听到=音量/静音问题）', true);
      return;
    }
    if (act === 'test-zh' || act === 'test-en') {
      const id = act === 'test-zh' ? 'st-zh' : 'st-en';
      setTestResult(id, '⏳ 正在朗读…', true);
      Voice.speak(act === 'test-zh' ? '你好，你好' : 'one, two, three', { lang: act === 'test-zh' ? 'zh-CN' : 'en-US' })
        .then(function (ok) {
          setTestResult(id, ok ? '✅ 朗读完成' : '❌ 失败：' + (Voice.lastTtsError || '未知原因（看下方建议）'), ok);
        });
      return;
    }
    if (act === 'open-review') { goReview(); return; }
    if (act === 'open-dashboard') { goDashboard(); return; }
    if (act === 'switch-profile') { Store.switchProfile(node.dataset.id); renderHome(); return; }
    if (act === 'add-profile') {
      const name = window.prompt('给新用户起个名字（如：圆圆 / 弟弟）：', '新用户');
      if (name !== null) { Store.addProfile((name.trim() || '新用户')); renderHome(); }
      return;
    }
    if (act === 'toggle-manage') { state.manage = !state.manage; renderHome(); return; }
    if (act === 'rename-profile') {
      const id = node.dataset.id;
      const cur = Store.listProfiles().filter(function (p) { return p.id === id; })[0];
      const name = window.prompt('修改名字：', cur ? cur.name : '');
      if (name !== null) { Store.renameProfile(id, (name.trim() || '用户')); renderHome(); }
      return;
    }
    if (act === 'delete-profile') {
      if (window.confirm('确定删除该用户及其学习进度吗？')) { Store.deleteProfile(node.dataset.id); renderHome(); }
      return;
    }
    if (act === 'review-play') {
      const list = Store.getWrongList(); const it = list[reviewIdx];
      if (it) Voice.speak(it.py && !it.en ? it.zh : it.en, { lang: (it.py && !it.en) ? 'zh-CN' : 'en-US' });
      return;
    }
    if (act === 'review-master') {
      const list = Store.getWrongList(); const it = list[reviewIdx];
      if (it) Store.removeWrong(it.key);
      const nl = Store.getWrongList();
      if (reviewIdx >= nl.length) reviewIdx = Math.max(0, nl.length - 1);
      renderReview(); return;
    }
    if (act === 'review-clear') { Store.clearWrong(); reviewIdx = 0; renderReview(); return; }
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
        // 更新自动生效：页面本有旧 SW 接管、之后换成新 SW 时，自动刷新一次加载新代码
        if (navigator.serviceWorker.controller) {
          let refreshed = false;
          navigator.serviceWorker.addEventListener('controllerchange', function () {
            if (!refreshed) { refreshed = true; location.reload(); }
          });
        }
      });
    }
    renderHome();
  }
  init();
})();
