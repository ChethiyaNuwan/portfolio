import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  modules: ["@nuxtjs/color-mode", "@nuxt/fonts", "motion-v/nuxt"],

  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  // Auto-register components by file name (no folder prefix), e.g. Hero/Hero.vue -> <Hero />
  components: [{ path: "~/components", pathPrefix: false }],

  // Keeps the previous behaviour: dark by default, <html data-theme="dark|light">
  colorMode: {
    preference: "dark",
    fallback: "dark",
    classSuffix: "",
    dataValue: "theme",
  },

  fonts: {
    families: [
      { name: "Space Grotesk", provider: "google", weights: [400, 500, 600, 700] },
      { name: "IBM Plex Mono", provider: "google", weights: [400, 500, 600, 700] },
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
