// CBSE Smart Portal — Service Worker
const CACHE = 'cbse-portal-v1';
const ASSETS = [
    "./index.html",
    "./assets/style.css",
    "./assets/app.js",
    "./science/chapter_11.html",
    "./science/chapter_05.html",
    "./social history/chapter_06.html",
    "./social history/chapter_05.html",
    "./social civics/chapter_06.html",
    "./social civics/chapter_04.html",
    "./social civics/chapter_07.html",
    "./it/chapter_09.html",
    "./it/chapter_02.html",
    "./computerscience/chapter_09.html",
    "./social geo/chapter_06.html",
    "./social geo/chapter_05.html",
    "./maths/chapter_15.html",
    "./maths/chapter_09.html",
    "./maths/chapter_08.html",
    "./maths/chapter_07.html",
    "./maths/chapter_06.html",
    "./ComputerScience/Chapter_09.html",
    "./IT/Chapter_02.html",
    "./IT/Chapter_09.html",
    "./Maths/Chapter_06.html",
    "./Maths/Chapter_07.html",
    "./Maths/Chapter_08.html",
    "./Maths/Chapter_09.html",
    "./Maths/Chapter_15.html",
    "./Science/Chapter_05.html",
    "./Science/Chapter_11.html",
    "./Science/Chapter_18.html",
    "./Social_Civics/Chapter_04.html",
    "./Social_Civics/Chapter_06.html",
    "./Social_Civics/Chapter_07.html",
    "./Social_Geo/Chapter_05.html",
    "./Social_Geo/Chapter_06.html",
    "./Social_History/Chapter_05.html",
    "./Social_History/Chapter_06.html"
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
