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

  fonts: {
    families: [
      { name: "Space Grotesk", provider: "google", weights: [400, 500, 600, 700] },
      { name: "IBM Plex Sans", provider: "google", weights: [400, 500, 600] },
    ],
  },

  app: {
    head: {
      htmlAttrs: { lang: "en" },
      title: "Chethiya Nuwan • Portfolio",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "My personal portfolio showcasing projects, skills, and experience.",
        },
        {
          name: "keywords",
          content:
            "Chethiya Nuwan, Portfolio, Software Engineer, Web Developer, Projects, Skills, Experience",
        },
        { name: "robots", content: "index, follow" },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://chethiyanuwan.github.io/portfolio" },
        { property: "og:title", content: "Chethiya Nuwan • Portfolio" },
        {
          property: "og:description",
          content:
            "Passionate software engineer building user-friendly, scalable applications with Nuxt and modern technologies.",
        },
        {
          property: "og:image",
          content: "https://chethiyanuwan.github.io/portfolio/favicon.ico",
        },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: "Chethiya Nuwan • Portfolio" },
      ],
      link: [
        { rel: "icon", href: "/favicon.ico", sizes: "any" },
        { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "apple-touch-icon", href: "/favicon.ico" },
      ],
    },
  },
});
