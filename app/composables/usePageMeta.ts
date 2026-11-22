import { jsonLdScript } from "../../server/lib/seo";

interface PageMeta {
  title: string;
  description: string;
  /** Path of this page, e.g. "/work" ("/" for home) */
  path: string;
  /** Extra JSON-LD objects for this page */
  jsonLd?: object[];
  /** Absolute or site-relative image for social previews (defaults to the profile photo) */
  image?: string;
  noindex?: boolean;
}

/** Title, description, canonical, Open Graph / Twitter cards and JSON-LD for one page. */
export function usePageMeta(meta: PageMeta) {
  const config = useRuntimeConfig();
  const origin = (config.public.siteUrl as string) || useRequestURL().origin;
  const site = origin.replace(/\/+$/, "");
  const url = `${site}${meta.path === "/" ? "/" : meta.path}`;
  const image = (meta.image ?? "").startsWith("http") ? meta.image! : `${site}${meta.image || "/profile.jpg"}`;

  useSeoMeta({
    title: meta.title,
    description: meta.description,
    robots: meta.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    ogType: "website",
    ogSiteName: "Chethiya Nuwan",
    ogTitle: meta.title,
    ogDescription: meta.description,
    ogUrl: url,
    ogImage: image,
    twitterCard: "summary_large_image",
    twitterTitle: meta.title,
    twitterDescription: meta.description,
    twitterImage: image,
  });

  useHead({
    link: [
      { rel: "canonical", href: url },
      { rel: "alternate", type: "text/plain", href: `${site}/llms.txt`, title: "llms.txt (portfolio summary for AI agents)" },
    ],
    meta: [
      { name: "theme-color", content: "#ffffff", media: "(prefers-color-scheme: light)" },
      { name: "theme-color", content: "#000000", media: "(prefers-color-scheme: dark)" },
    ],
    script: (meta.jsonLd ?? []).map((obj) => ({ type: "application/ld+json", innerHTML: jsonLdScript(obj) })),
  });

  return { site, url };
}
