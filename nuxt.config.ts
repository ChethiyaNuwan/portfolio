export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  modules: ["@nuxt/ui"],

  css: ["~/assets/css/main.css"],

  // Auto-register components by file name (no folder prefix), e.g. Hero/Hero.vue -> <Hero />
  components: [{ path: "~/components", pathPrefix: false }],

  colorMode: { preference: "system", fallback: "light" },

  // Bundle the icons we use so nothing is fetched from the Iconify API at runtime (CSP)
  icon: { clientBundle: { scan: true } },

  // Public site URL used for canonical links, sitemap and llms.txt. Override at runtime with NUXT_PUBLIC_SITE_URL.
  runtimeConfig: { public: { siteUrl: "", gaId: "", posthogKey: "", posthogHost: "https://us.i.posthog.com" } },

  fonts: {
    families: [
      { name: "Space Grotesk", provider: "google", weights: ["300 700"] },
      { name: "IBM Plex Sans", provider: "google", weights: [400, 500, 600] },
    ],
  },

  // The service worker must always be re-checked so updates reach visitors
  routeRules: { "/sw.js": { headers: { "cache-control": "no-cache" } } },

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      htmlAttrs: { lang: "en" },
      title: "Chethiya Nuwan • Portfolio",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { name: "theme-color", content: "#000000", media: "(prefers-color-scheme: dark)" },
        { name: "theme-color", content: "#ffffff", media: "(prefers-color-scheme: light)" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      ],
      link: [
        { rel: "icon", href: "/favicon.ico", sizes: "any" },
        { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" },
        { rel: "manifest", href: "/manifest.webmanifest" },
      ],
    },
  },
});
