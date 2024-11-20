const CACHE_NAME = 'blocks-cache-v1';
const ASSETS_TO_CACHE = [
  '/blocks/',
  '/blocks/blocks.js',
  '/blocks/blocks.css',
  '/blocks/favicon.ico',
  '/blocks/blocks-192x192.png',
  '/blocks/blocks-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});