/* VIDSTREAM — Service Worker */

const VER = 'v1';
const CACHE = 'vidstream-' + VER;

const PRECACHE = [
  './',
  './index.html',
  './welcome.html',
  './home/index.html',
  './signup/index.html',
  './settings/index.html',
  './downloads/index.html'
];

/* INSTALL */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(async cache => {
        await Promise.all(
          PRECACHE.map(async url => {
            try {
              const response = await fetch(url, {
                cache: 'no-cache'
              });

              if (response.ok) {
                await cache.put(url, response);
              }
            } catch (error) {
              console.warn(
                'Precache skipped:',
                url,
                error
              );
            }
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

/* ACTIVATE */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

/* FETCH */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (event.request.method !== 'GET') {
    return;
  }

  // Kada a cache Supabase requests
  if (url.hostname.includes('supabase.co')) {
    return;
  }

  /* YouTube API — Network First */
  if (url.hostname.endsWith('googleapis.com')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();

          caches.open(CACHE)
            .then(cache => {
              cache.put(event.request, copy);
            });

          return response;
        })
        .catch(() => caches.match(event.request))
    );

    return;
  }

  /* Thumbnails — Cache First */
  if (
    url.hostname.includes('ytimg.com') ||
    url.hostname.includes('storage.googleapis.com')
  ) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          return (
            cachedResponse ||
            fetch(event.request).then(response => {
              const copy = response.clone();

              caches.open(CACHE)
                .then(cache => {
                  cache.put(event.request, copy);
                });

              return response;
            })
          );
        })
    );

    return;
  }

  /* App Pages — Stale While Revalidate */
  if (
    event.request.mode === 'navigate' ||
    url.origin === location.origin
  ) {
    event.respondWith(
      caches.open(CACHE).then(async cache => {
        const cachedResponse = await cache.match(
          event.request
        );

        const networkResponse = fetch(event.request)
          .then(response => {
            cache.put(
              event.request,
              response.clone()
            );

            return response;
          })
          .catch(() => cachedResponse);

        return cachedResponse || networkResponse;
      })
    );
  }
});
