const CACHE_NAME = 'codelingo-v1.4.0';
const ASSETS = [
  './',
  './index.html',
  './index.css',
  './app.js',
  './assets/icon.png',
  './data/i18n.js',
  './data/courses.js',
  './data/gamification.js',
  './data/reference.js',
  './components/auth.js',
  './components/home.js',
  './components/course.js',
  './components/lesson.js',
  './components/leaderboard.js',
  './components/profile.js',
  './components/ai.js',
  './components/settings.js',
  './components/sandbox.js',
  './components/reference.js',
  './components/tutorial.js',
  './components/about.js',
  './privacy.html',
  './manifest.json'
];

// Install: Cache all critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Service Worker: Caching Assets');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Clearing Old Cache', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch: Stale-While-Revalidate strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
      });
    })
  );
});
