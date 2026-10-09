// Service Worker：缓存应用外壳，支持平板离线使用 / 安装到桌面
// 策略：HTML/JS/CSS 网络优先（有网永远拿最新代码），图标等静态资源缓存优先
// 注意：每次改动代码文件后，必须把 CACHE 版本号 +1，客户端才会换新缓存
const CACHE = 'english-kids-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/data.js',
  './js/voice.js',
  './js/storage.js',
  './js/app.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const sameOrigin = url.origin === self.location.origin;
  // 页面导航 + 代码/样式/清单：网络优先，离线回退缓存
  const isShell = sameOrigin &&
    (e.request.mode === 'navigate' || /\.(js|css|html|json)$/.test(url.pathname));
  if (isShell) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html')))
    );
  } else {
    // 其他资源（图标等）：缓存优先
    e.respondWith(
      caches.match(e.request).then((cached) => cached ||
        fetch(e.request).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        }))
    );
  }
});
