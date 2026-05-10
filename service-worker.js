// GitHub Pages Dashboard - Service Worker
// Enables offline functionality and caches app assets

const CACHE_NAME = 'github-pages-dashboard-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json'
];

// Install event - cache app shell
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(ASSETS_TO_CACHE);
        }).catch((err) => {
            console.log('[ServiceWorker] Cache addAll error:', err);
        })
    );
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[ServiceWorker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Claim all clients
    return self.clients.claim();
});

// Fetch event - network-first strategy for API, cache-first for assets
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests and non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // GitHub API requests - network-first strategy
    if (url.origin === 'https://api.github.com') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clone the response
                    const clonedResponse = response.clone();

                    // Cache successful API responses
                    if (response.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, clonedResponse);
                        });
                    }

                    return response;
                })
                .catch(() => {
                    // Network failed, try cache
                    return caches.match(request).then((cachedResponse) => {
                        if (cachedResponse) {
                            console.log('[ServiceWorker] Serving from cache:', request.url);
                            return cachedResponse;
                        }
                        // Return offline response
                        return new Response(
                            JSON.stringify({
                                error: 'Network error',
                                message: 'Unable to fetch data. Please check your connection.'
                            }),
                            {
                                status: 503,
                                statusText: 'Service Unavailable',
                                headers: new Headers({
                                    'Content-Type': 'application/json'
                                })
                            }
                        );
                    });
                })
        );
        return;
    }

    // Local assets - cache-first strategy
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('[ServiceWorker] Serving from cache:', request.url);
                    return cachedResponse;
                }

                return fetch(request).then((response) => {
                    // Clone the response
                    const clonedResponse = response.clone();

                    // Cache successful responses
                    if (response.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, clonedResponse);
                        });
                    }

                    return response;
                }).catch(() => {
                    // Network failed and not in cache
                    console.log('[ServiceWorker] Offline and not in cache:', request.url);
                    // Return a generic offline page or response
                    return new Response(
                        'Offline - Page not available',
                        {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        }
                    );
                });
            })
        );
        return;
    }

    // For all other requests (external resources, CDN, etc.)
    event.respondWith(
        fetch(request)
            .then((response) => {
                const clonedResponse = response.clone();
                if (response.status === 200 && request.destination !== '') {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, clonedResponse);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(request).catch(() => {
                    return new Response(
                        'Offline - Resource not available',
                        {
                            status: 503,
                            statusText: 'Service Unavailable'
                        }
                    );
                });
            })
    );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
