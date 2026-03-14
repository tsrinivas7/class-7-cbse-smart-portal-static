// CBSE Smart Portal — Service Worker (hash-based smart cache)
const CACHE = 'cbse-portal-v2';
const ASSETS = [
    "./index.html",
    "./assets/style.css",
    "./assets/app.js",
    "./maths/chapter_15.html",
    "./maths/chapter_09.html",
    "./maths/chapter_08.html",
    "./maths/chapter_07.html",
    "./maths/chapter_06.html",
    "./class10_history/chapter_01.html",
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
    "./social_geo/chapter_06.html",
    "./social_geo/chapter_05.html"
];
const VERSION_URL = './version.json';

// ── Install: pre-cache all pages ─────────────────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

// ── Activate: delete old caches, claim clients immediately ───────────────────
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// ── Background sync: check version.json, update only changed files ───────────
async function syncCache() {
  let remoteVersions;
  try {
    const resp = await fetch(VERSION_URL, { cache: 'no-store' });
    if (!resp.ok) return;
    remoteVersions = await resp.json();
  } catch { return; }   // offline — skip sync

  const cache = await caches.open(CACHE);

  // Load previously stored version map (if any)
  const storedResp = await cache.match('__versions__');
  const storedVersions = storedResp ? await storedResp.json() : {};

  const files = remoteVersions.files || {};
  const updates = [];

  for (const [path, hash] of Object.entries(files)) {
    if (storedVersions[path] !== hash) {
      // Hash changed (or not cached yet) → fetch fresh copy
      updates.push(
        fetch(path, { cache: 'no-store' })
          .then(r => r.ok ? cache.put(path, r) : null)
          .catch(() => null)
      );
    }
  }

  if (updates.length > 0) {
    await Promise.all(updates);
    console.log(`[SW] Updated ${updates.length} file(s) from server.`);
  } else {
    console.log('[SW] Cache is up-to-date. No changes fetched.');
  }

  // Store the new version map so next check can diff against it
  await cache.put('__versions__', new Response(JSON.stringify(files),
    { headers: { 'Content-Type': 'application/json' } }));
}

// ── Fetch: serve from cache, then trigger background sync ────────────────────
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Always fetch version.json fresh from network (never cache it directly)
  if (url.pathname.endsWith('version.json')) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }));
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      // Kick off a background sync on every page load (non-blocking)
      syncCache();
      // Serve from cache instantly if available, else fetch from network
      return cached || fetch(e.request).then(resp => {
        caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
        return resp;
      });
    })
  );
});
