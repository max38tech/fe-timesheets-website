// This file is used for cache fallback in the service worker
const CACHE_NAME = 'fe-timesheets-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/assets/react.svg',
  '/vite.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
</write_to_file>

<apply_diff>
<path>index.html</path>
<diff>
<<<<<<< SEARCH
 1 | <!doctype html>
 2 | <html lang="en">
 3 |   <head>
 4 |     <meta charset="UTF-8" />
 5 |     <link rel="icon" type="image/svg+xml" href="/vite.svg" />
 6 |     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 7 |     <title>Vite + React</title>
=======
 1 | <!doctype html>
 2 | <html lang="en">
 3 |   <head>
