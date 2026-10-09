// Hält die App offline startbar. Bei Änderungen an der App die Versionsnummer erhöhen.
const CACHE = 'einkauf-v27';
const FILES = ['./', 'config.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  // Erst das Netz versuchen (damit Updates ankommen), ohne Netz aus dem Speicher.
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request.mode === 'navigate' ? './' : e.request, copy)); }
      return r;
    }).catch(() => caches.match(e.request.mode === 'navigate' ? './' : e.request, { ignoreSearch: true }))
  );
});
