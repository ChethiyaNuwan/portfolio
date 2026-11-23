// Service worker: makes the site installable and usable offline.
//  - pages: network first, so visitors always get fresh content; the last good copy is the fallback offline
//  - built assets, images, fonts: cache first (assets under /_nuxt/ have hashed names, so they never go stale)
//  - never cached: /api/, /admin, /cv and anything that is not a plain GET
const VERSION = "v1";
const PAGES = `pages-${VERSION}`;
const ASSETS = `assets-${VERSION}`;
const OFFLINE = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(PAGES).then((c) => c.addAll([OFFLINE, "/icons/icon-192.png"])).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => ![PAGES, ASSETS].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const skip = (url) => url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin") || url.pathname === "/cv" || url.pathname === "/sw.js";

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || skip(url)) return;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(async () => (await caches.match(req)) || (await caches.match(OFFLINE)) || Response.error()),
    );
    return;
  }

  const cacheable = url.pathname.startsWith("/_nuxt/") || url.pathname.startsWith("/_fonts/") || url.pathname.startsWith("/uploads/") || url.pathname.startsWith("/icons/") || /\.(?:png|jpe?g|webp|avif|gif|svg|ico|woff2?)$/i.test(url.pathname);
  if (!cacheable) return;
  event.respondWith(
    caches.open(ASSETS).then(async (cache) => {
      const hit = await cache.match(req);
      if (hit) {
        // uploads can be replaced under the same name: refresh them in the background
        if (url.pathname.startsWith("/uploads/")) fetch(req).then((r) => r.ok && cache.put(req, r)).catch(() => {});
        return hit;
      }
      const res = await fetch(req);
      if (res.ok) cache.put(req, res.clone());
      return res;
    }),
  );
});
