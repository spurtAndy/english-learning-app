/* ============================================================
 * 进度存储：localStorage 记录每关星级，支撑闯关解锁
 * 关卡键格式： gradeId:unitId:stageIndex
 * 星级含义：0=未通关，1~3=星级（越高表现越好）
 * ============================================================ */

const Store = (function () {
  const KEY = 'english_kids_progress_v1';

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return { stars: {}, settings: {}, wrong: {} };
  }

  let data = load();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }

  // 读取某关星级
  function getStage(gradeId, unitId, stageIdx) {
    const k = gradeId + ':' + unitId + ':' + stageIdx;
    return data.stars[k] || 0;
  }

  // 写入某关星级（取更高值，避免回退）
  function setStage(gradeId, unitId, stageIdx, stars) {
    const k = gradeId + ':' + unitId + ':' + stageIdx;
    data.stars[k] = Math.max(data.stars[k] || 0, stars);
    save();
  }

  // 总星数
  function totalStars() {
    let sum = 0;
    const vals = Object.keys(data.stars);
    for (let i = 0; i < vals.length; i++) sum += data.stars[vals[i]];
    return sum;
  }

  // 错词本：记录答错的单词/拼音（长期保留，用于复习模式）
  function recordWrong(entry) {
    const key = [entry.subjectId, entry.gradeId, entry.unitId, entry.en || entry.py].join('|');
    const cur = data.wrong[key] || { count: 0 };
    cur.subjectId = entry.subjectId; cur.gradeId = entry.gradeId; cur.unitId = entry.unitId;
    cur.en = entry.en || ''; cur.zh = entry.zh || ''; cur.py = entry.py || ''; cur.emoji = entry.emoji || '🔤';
    cur.key = key;
    cur.count = (cur.count || 0) + 1; cur.last = Date.now();
    data.wrong[key] = cur; save();
  }
  function getWrongList() {
    return Object.keys(data.wrong).map(function (k) { return data.wrong[k]; });
  }
  function wrongCount() { return Object.keys(data.wrong).length; }
  function clearWrong() { data.wrong = {}; save(); }
  function removeWrong(k) { if (data.wrong[k]) { delete data.wrong[k]; save(); } }

  function resetAll() {
    data = { stars: {}, settings: {}, wrong: data.wrong || {} };
    save();
  }

  return {
    getStage: getStage,
    setStage: setStage,
    totalStars: totalStars,
    recordWrong: recordWrong,
    getWrongList: getWrongList,
    wrongCount: wrongCount,
    clearWrong: clearWrong,
    removeWrong: removeWrong,
    resetAll: resetAll,
    save: save
  };
})();

if (typeof window !== 'undefined') window.Store = Store;
