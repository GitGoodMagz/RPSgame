const CACHE_NAME = "rpsgame-v2";

const APP_SHELL = [
  "/",
  "/index.html",
  "/app.css",
  "/app.mjs",
  "/manifest.webmanifest",
  "/offline.html",
  "/ToS.html",
  "/dataPrivacyPolicy.html",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/app/api.mjs",
  "/app/dom.mjs",
  "/app/i18n.mjs",
  "/app/legalDialog.mjs",
  "/app/nav.mjs",
  "/app/state.mjs",
  "/app/users.mjs",
  "/app/userService.mjs",
  "/app/components/userCreate.mjs",
  "/app/components/userManage.mjs"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cachedRequest = await caches.match(request);
          const cachedIndex = await caches.match("/index.html");
          return cachedRequest || cachedIndex || caches.match("/offline.html");
        })
    );
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || new Response(
            JSON.stringify({ ok: false, error: "offline", message: "Offline" }),
            { headers: { "Content-Type": "application/json" }, status: 503 }
          );
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      });
    })
  );
});
