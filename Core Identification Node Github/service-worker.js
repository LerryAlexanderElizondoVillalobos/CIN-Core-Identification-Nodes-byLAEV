const CACHE_NAME = "cin-genesis-lobby-v6";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./cin-icon.svg",
  "./cin-github-config.js",
  "./cin-github-lobby.js",
  "./cin-local-runtime-test.js",
  "./CIN-GENESIS-ENVIRONMENT.cincert",
  "./CIN-NODE-BIRTH.cincert",
  "./CIN-PERSONAL-REGISTRATION.cincert"
];
const NETWORK_FIRST = new Set([
  "./",
  "./index.html",
  "./cin-github-config.js",
  "./cin-github-lobby.js",
  "./cin-local-runtime-test.js",
  "./CIN-GENESIS-ENVIRONMENT.cincert",
  "./CIN-NODE-BIRTH.cincert",
  "./CIN-PERSONAL-REGISTRATION.cincert"
]);
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // OAuth callback query parameters must never be persisted in the service-worker cache.
  if (url.searchParams.has("code") || url.searchParams.has("state") || url.searchParams.has("error")) {
    event.respondWith(fetch(request, { cache: "no-store" }));
    return;
  }

  const relativePath = url.pathname.endsWith("/index.html") ? "./index.html" :
    (url.pathname === new URL(self.registration.scope).pathname ? "./" : "./" + url.pathname.split("/").pop());
  if (NETWORK_FIRST.has(relativePath)) {
    event.respondWith(
      fetch(request, { cache: "no-store" }).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(relativePath, copy));
        }
        return response;
      }).catch(() => caches.match(relativePath))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    }))
  );
});
