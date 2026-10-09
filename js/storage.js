/* ============================================================
 * 进度存储：localStorage 记录每个用户的每关星级与错词本
 * 支持多用户：每个儿童一个档案，进度互不干扰
 * 关卡键格式： gradeId:unitId:stageIndex
 * 星级含义：0=未通关，1~3=星级（越高表现越好）
 * ============================================================ */

const Store = (function () {
  // 多用户总表：{ profiles: { id: {name, stars, wrong} }, current: id }
  const KEY = 'english_kids_profiles_v1';
  const DEFAULT_NAME = '宝贝';

  function uid() { return 'u' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36); }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && d.profiles && typeof d.profiles === 'object') return d;
      }
    } catch (e) { /* ignore */ }
    // 首次使用：自动创建一个默认档案
    const id = uid();
    return { profiles: { [id]: { name: DEFAULT_NAME, stars: {}, wrong: {} } }, current: id };
  }

  let data = load();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }

  // 确保有"当前用户"，并返回该用户对象
  function cur() {
    if (!data.current || !data.profiles[data.current]) {
      const ids = Object.keys(data.profiles);
      data.current = ids[0] || null;
    }
    if (!data.current) {
      const nid = uid();
      data.profiles[nid] = { name: DEFAULT_NAME, stars: {}, wrong: {} };
      data.current = nid; save();
    }
    return data.profiles[data.current];
  }

  /* ---------------- 当前用户的进度（按关卡） ---------------- */
  function getStage(gradeId, unitId, stageIdx) {
    const p = cur(); const k = gradeId + ':' + unitId + ':' + stageIdx;
    return (p.stars && p.stars[k]) || 0;
  }
  function setStage(gradeId, unitId, stageIdx, stars) {
    const p = cur(); if (!p.stars) p.stars = {};
    const k = gradeId + ':' + unitId + ':' + stageIdx;
    p.stars[k] = Math.max(p.stars[k] || 0, stars);
    save();
  }
  function totalStars() {
    const p = cur(); if (!p.stars) return 0;
    let sum = 0; Object.keys(p.stars).forEach(function (k) { sum += p.stars[k]; });
    return sum;
  }

  /* ---------------- 错词本（按用户） ---------------- */
  function recordWrong(entry) {
    const p = cur(); if (!p.wrong) p.wrong = {};
    const key = [entry.subjectId, entry.gradeId, entry.unitId, entry.en || entry.py].join('|');
    const c = p.wrong[key] || { count: 0 };
    c.subjectId = entry.subjectId; c.gradeId = entry.gradeId; c.unitId = entry.unitId;
    c.en = entry.en || ''; c.zh = entry.zh || ''; c.py = entry.py || ''; c.emoji = entry.emoji || '🔤';
    c.key = key; c.count = (c.count || 0) + 1; c.last = Date.now();
    p.wrong[key] = c; save();
  }
  function getWrongList() {
    const p = cur();
    return p.wrong ? Object.keys(p.wrong).map(function (k) { return p.wrong[k]; }) : [];
  }
  function wrongCount() { const p = cur(); return p.wrong ? Object.keys(p.wrong).length : 0; }
  function clearWrong() { const p = cur(); p.wrong = {}; save(); }
  function removeWrong(k) { const p = cur(); if (p.wrong && p.wrong[k]) { delete p.wrong[k]; save(); } }

  // 重置当前用户的星级（错词本保留）
  function resetAll() {
    const p = cur(); p.stars = {}; if (!p.wrong) p.wrong = {}; save();
  }

  /* ---------------- 多用户档案管理 ---------------- */
  function listProfiles() {
    return Object.keys(data.profiles).map(function (id) {
      return { id: id, name: data.profiles[id].name, current: id === data.current };
    });
  }
  function addProfile(name) {
    const id = uid();
    data.profiles[id] = { name: (name || DEFAULT_NAME), stars: {}, wrong: {} };
    data.current = id; save(); return id;
  }
  function switchProfile(id) { if (data.profiles[id]) { data.current = id; save(); } }
  function renameProfile(id, name) {
    if (data.profiles[id]) { data.profiles[id].name = (name || data.profiles[id].name); save(); }
  }
  function deleteProfile(id) {
    if (!data.profiles[id]) return;
    if (Object.keys(data.profiles).length <= 1) return; // 至少保留 1 个用户
    delete data.profiles[id];
    if (data.current === id) data.current = Object.keys(data.profiles)[0];
    save();
  }
  function currentProfile() {
    const id = data.current;
    return { id: id, name: (data.profiles[id] && data.profiles[id].name) || DEFAULT_NAME };
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
    listProfiles: listProfiles,
    addProfile: addProfile,
    switchProfile: switchProfile,
    renameProfile: renameProfile,
    deleteProfile: deleteProfile,
    currentProfile: currentProfile,
    save: save
  };
})();

if (typeof window !== 'undefined') window.Store = Store;
