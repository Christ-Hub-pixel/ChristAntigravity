
const CACHE_NAME = 'codelingo-v1';
const ASSETS = [
  './',
  './CodeLingo.html',
  './index.css',
  './app.js',
  './assets/icon.png',
  './assets/logo.png',
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

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
