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
    return { stars: {}, settings: {} };
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

  function resetAll() {
    data = { stars: {}, settings: {} };
    save();
  }

  return {
    getStage: getStage,
    setStage: setStage,
    totalStars: totalStars,
    resetAll: resetAll,
    save: save
  };
})();

if (typeof window !== 'undefined') window.Store = Store;
