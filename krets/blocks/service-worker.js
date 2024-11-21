const CACHE_PREFIX = 'blocks-cache';
const CURRENT_VERSION = 'v1.0.5';

const ASSETS_TO_CACHE = [
  `/blocks/blocks.js?v=${CURRENT_VERSION}`,
  `/blocks/blocks.css?v=${CURRENT_VERSION}`,
  '/blocks/favicon.ico',
  '/blocks/blocks-192x192.png',
  '/blocks/blocks-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(`${CACHE_PREFIX}-${CURRENT_VERSION}`)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== `${CACHE_PREFIX}-${CURRENT_VERSION}`) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request).then(fetchResponse => {
          return caches.open(`${CACHE_PREFIX}-${CURRENT_VERSION}`).then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
  );
});