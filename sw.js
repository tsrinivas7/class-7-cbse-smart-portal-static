// CBSE Smart Portal — Service Worker
const CACHE = 'cbse-portal-v1';
const ASSETS = [
    "./index.html",
    "./assets/style.css",
    "./assets/app.js",
    "./science/chapter_11.html",
    "./science/chapter_05.html",
    "./science/chapter_18.html",
    "./social_history/chapter_06.html",
    "./social_history/chapter_05.html",
    "./social_civics/chapter_06.html",
    "./social_civics/chapter_04.html",
    "./social_civics/chapter_07.html",
    "./it/chapter_09.html",
    "./it/chapter_02.html",
    "./computerscience/chapter_09.html",
    "./social_geo/chapter_06.html",
    "./social_geo/chapter_05.html",
    "./maths/chapter_15.html",
    "./maths/chapter_09.html",
    "./maths/chapter_08.html",
    "./maths/chapter_07.html",
    "./maths/chapter_06.html"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
