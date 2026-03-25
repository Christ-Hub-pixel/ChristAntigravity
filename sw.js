const CACHE_NAME = 'codelingo-v1.1.2';
const ASSETS = [
  './',
  './index.html',
  './index.css',
  './app.js',
  './assets/icon.png',
  './data/i18n.js',
  './data/gamification.js',
  './data/courses.js',
  './components/auth.js',
  './components/home.js',
  './components/course.js',
  './components/lesson.js',
  './components/leaderboard.js',
  './components/profile.js'
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

// Fetch: Cache-First strategy with Network Fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Use cached version if available, else fetch from network
      return response || fetch(event.request).catch(() => {
        // If both fail (offline and not in cache), return custom offline response or nothing
        return caches.match('./index.html');
      });
    })
  );
});
