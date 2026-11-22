import type { Content } from "./schemas";

export function normalizeSiteUrl(configured: string | undefined, requestOrigin: string): string {
  const pick = configured?.trim() || requestOrigin;
  return pick.replace(/\/+$/, "");
}

export function absoluteUrl(site: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${site}/${path.replace(/^\/+/, "")}`;
}

/** External project links are stored without a scheme (e.g. "example.com"). */
const externalUrl = (link: string) => (/^https?:\/\//i.test(link) ? link : `https://${link}`);

/** JSON for an inline <script type="application/ld+json"> that cannot close the tag early. */
export function jsonLdScript(data: unknown): string {
  const LS = String.fromCharCode(0x2028);
  const PS = String.fromCharCode(0x2029);
  return JSON.stringify(data).replace(/</g, "\\u003c").split(LS).join("\\u2028").split(PS).join("\\u2029");
}

const firstSentence = (s: string) => s.trim().split(/(?<=[.!?])\s/)[0] ?? "";
const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

const PAGES = [
  { path: "", name: "Home", about: "Introduction, selected work, experience, skills and contact." },
  { path: "/work", name: "Work", about: "All projects with screenshots and details." },
  { path: "/gallery", name: "Gallery", about: "Interface and design images from the projects." },
  { path: "/services", name: "Services", about: "Services offered and tools used." },
  { path: "/contact", name: "Contact", about: "Email address, social links and frequently asked questions." },
];

export function llmsTxt(c: Content, site: string): string {
  const p = c.profile;
  const where = p.location ? ` based in ${p.location}` : "";
  const lines = [
    `# ${p.name}`,
    "",
    `> ${p.title}${where}. ${oneLine(p.intro)}`,
    "",
    `Contact: ${p.email}. This is a personal portfolio website; the pages below describe the person, their work and how to get in touch.`,
    "",
    "## Pages",
    ...PAGES.map((pg) => `- [${pg.name}](${site}${pg.path || "/"}): ${pg.about}`),
    "",
  ];
  if (c.projects.length) {
    lines.push("## Work", ...c.projects.map((pr) => `- [${pr.title}](${externalUrl(pr.link)}): ${firstSentence(pr.description)}`), "");
  }
  lines.push(
    "## Optional",
    `- [Full content](${site}/llms-full.txt): the complete portfolio as one Markdown document`,
    `- [Résumé (PDF)](${site}/cv): downloadable CV`,
    "",
  );
  return lines.join("\n");
}

export function llmsFullTxt(c: Content, site: string): string {
  const p = c.profile;
  const out: string[] = [`# ${p.name}`, "", `${p.title}`, ""];
  out.push(oneLine(p.intro), "");
  out.push("## Contact", `- Email: ${p.email}`);
  if (p.phone) out.push(`- Phone: ${p.phone}`);
  if (p.location) out.push(`- Location: ${p.location}`);
  for (const s of c.socials) out.push(`- ${s.title}: ${s.link}`);
  out.push(`- Website: ${site}/`, "");

  if (c.experience.length) {
    out.push("## Experience");
    for (const e of c.experience) {
      out.push(`### ${e.title}, ${e.company} (${e.year})`);
      if (e.labels.length) out.push(`Focus: ${e.labels.join(", ")}`);
      out.push(oneLine(e.description), "");
    }
  }
  if (c.stack.length) out.push("## Skills", c.stack.map((s) => s.title).join(", "), "");
  if (c.education.length) {
    out.push("## Education");
    for (const e of c.education) out.push(`- ${e.degree}, ${e.school} (${e.period})${e.details ? `: ${oneLine(e.details)}` : ""}`);
    out.push("");
  }
  if (c.projects.length) {
    out.push("## Projects");
    for (const pr of c.projects) {
      out.push(`### ${pr.title}`, `- Link: ${externalUrl(pr.link)}`, `- Type: ${pr.type}${pr.tags.length ? ` (${pr.tags.join(", ")})` : ""}`, oneLine(pr.description), "");
    }
  }
  if (c.services.length) {
    out.push("## Services");
    for (const s of c.services) out.push(`- ${s.title}: ${oneLine(s.description)}`);
    out.push("");
  }
  if (c.faq.length) {
    out.push("## FAQ");
    for (const f of c.faq) out.push(`### ${f.question}`, oneLine(f.answer), "");
  }
  out.push(`Résumé (PDF): ${site}/cv`, "");
  return out.join("\n");
}

const xmlEscape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function sitemapXml(site: string): string {
  const urls = PAGES.map((pg) => `  <url><loc>${xmlEscape(site + pg.path)}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function robotsTxt(site: string): string {
  return ["User-agent: *", "Allow: /", "Allow: /llms.txt", "Allow: /llms-full.txt", "Disallow: /admin", "Disallow: /api/", "", `Sitemap: ${site}/sitemap.xml`, ""].join("\n");
}

const CTX = "https://schema.org";

export function personJsonLd(c: Content, site: string): object {
  const p = c.profile;
  const current = c.experience.find((e) => /present/i.test(e.year));
  return {
    "@context": CTX,
    "@type": "Person",
    "@id": `${site}/#person`,
    name: p.name,
    jobTitle: p.title,
    description: oneLine(p.intro),
    url: `${site}/`,
    image: absoluteUrl(site, p.avatar),
    email: `mailto:${p.email}`,
    ...(p.phone ? { telephone: p.phone } : {}),
    ...(p.location ? { address: { "@type": "PostalAddress", addressLocality: p.location } } : {}),
    sameAs: c.socials.map((s) => s.link).filter((u) => /^https?:\/\//i.test(u)),
    knowsAbout: c.stack.map((s) => s.title),
    ...(c.education.length ? { alumniOf: c.education.map((e) => ({ "@type": "EducationalOrganization", name: e.school })) } : {}),
    ...(current ? { worksFor: { "@type": "Organization", name: current.company } } : {}),
  };
}

export function websiteJsonLd(c: Content, site: string): object {
  return {
    "@context": CTX,
    "@type": "WebSite",
    "@id": `${site}/#website`,
    url: `${site}/`,
    name: `${c.profile.name} • Portfolio`,
    description: oneLine(c.profile.intro),
    inLanguage: "en",
    author: { "@id": `${site}/#person` },
  };
}

export function projectsJsonLd(c: Content, site: string): object {
  return {
    "@context": CTX,
    "@type": "ItemList",
    name: `Projects by ${c.profile.name}`,
    itemListElement: c.projects.map((pr, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: pr.title,
        description: oneLine(pr.description),
        url: externalUrl(pr.link),
        image: absoluteUrl(site, pr.image),
        genre: pr.type,
        keywords: pr.tags.join(", "),
        author: { "@id": `${site}/#person` },
      },
    })),
  };
}

export function galleryJsonLd(c: Content, site: string): object {
  return {
    "@context": CTX,
    "@type": "ImageGallery",
    name: `${c.profile.name} gallery`,
    url: `${site}/gallery`,
    image: c.gallery.map((g) => ({
      "@type": "ImageObject",
      contentUrl: absoluteUrl(site, g.image),
      caption: g.caption,
      keywords: g.tags.join(", "),
    })),
  };
}

export function faqJsonLd(c: Content): object {
  return {
    "@context": CTX,
    "@type": "FAQPage",
    mainEntity: c.faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
}
