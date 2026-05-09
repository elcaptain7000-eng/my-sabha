const CACHE_NAME = 'subha-ultimate-v7'; 
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // تم استخدام طريقة fetch لكل ملف لضمان عدم تعطل الكاش إذا سقط ملف واحد
      return Promise.all(
        assets.map(url => {
          return fetch(url).then(res => {
            if (res.ok) return cache.put(url, res);
          }).catch(err => console.log('فشل تحميل:', url));
        })
      );
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});