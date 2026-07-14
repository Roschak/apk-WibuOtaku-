const CACHE_VERSION = 'v1';
const STATIC_CACHE = `wo-static-${CACHE_VERSION}`;
const API_CACHE = `wo-api-${CACHE_VERSION}`;

const STATIC_URLS = [
    '/',
    '/anime/',
    '/manga/',
    '/light-novel/',
    '/kalender/',
    '/wishlist/',
    '/koleksi/',
    '/notifikasi/',
    '/profil/',
    '/search/',
    '/admin/',
    '/offline/',
];

// Install — cache shell resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            return cache.addAll(STATIC_URLS);
        }),
    );
    self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== STATIC_CACHE && key !== API_CACHE)
                    .map((key) => caches.delete(key)),
            );
        }),
    );
    self.clients.claim();
});

// Fetch — network-first for pages, cache-first for static assets
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // API calls (AniList) — network-first
    if (url.hostname === 'graphql.anilist.co') {
        event.respondWith(networkFirst(request, API_CACHE));
        return;
    }

    // Navigation requests — network-first (always show latest content)
    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request, STATIC_CACHE));
        return;
    }

    // Static assets (JS, CSS, images, fonts) — cache-first
    if (
        url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$/) ||
        url.pathname.startsWith('/_next/')
    ) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Everything else — network-first
    event.respondWith(networkFirst(request, STATIC_CACHE));
});

async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, response.clone());
        return response;
    } catch {
        return new Response('Offline', { status: 503 });
    }
}

async function networkFirst(request, cacheName) {
    try {
        const response = await fetch(request);
        const cache = await caches.open(cacheName);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) return cached;

        // If it's a navigation request, serve the cached homepage
        if (request.mode === 'navigate') {
            const home = await caches.match('/');
            if (home) return home;
        }

        return new Response('Offline', { status: 503 });
    }
}
