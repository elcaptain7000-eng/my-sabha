const CACHE_NAME = 'subha-ultimate-v5'; // غيرنا الاسم عشان يمسح القديم
const assets = [
  './',
  './index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// مرحلة التثبيت: خزن الملفات في ذاكرة الموبايل
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// مرحلة التفعيل: امسح أي نسخة قديمة معلقة
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// أهم مرحلة: سحب الملفات
self.addEventListener('fetch', e => {
  e.respondWith(
    // دور في المخزن (Cache) الأول
    caches.match(e.request, {ignoreSearch: true}).then(response => {
      // لو لقيته في المخزن افتحه فوراً (حتى لو مفيش نت)
      // لو مش موجود، روح هاته من النت
      return response || fetch(e.request).catch(() => {
        // لو مفيش نت خالص والملف مش مخزن، افتح الصفحة الرئيسية
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
