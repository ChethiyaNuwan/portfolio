// Web app manifest: the name and description follow the profile edited in the admin.
export default defineEventHandler((event) => {
  const { profile } = useStore().getContent();
  setHeader(event, "Content-Type", "application/manifest+json; charset=utf-8");
  setHeader(event, "Cache-Control", "public, max-age=3600");
  return {
    id: "/",
    name: `${profile.name} • Portfolio`,
    short_name: profile.name.split(/\s+/)[0] || "Portfolio",
    description: profile.title ? `${profile.name}, ${profile.title}. Portfolio.` : `${profile.name}. Portfolio.`,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#000000",
    theme_color: "#000000",
    lang: "en",
    categories: ["portfolio", "business"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Work", url: "/#work", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Contact", url: "/#contact", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
});
