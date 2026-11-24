import { describe, expect, test } from "bun:test";
import {
  absoluteUrl, faqJsonLd, jsonLdScript, llmsFullTxt, llmsTxt, normalizeSiteUrl,
  personJsonLd, projectsJsonLd, robotsTxt, sitemapXml,
} from "./seo";
import { seedContent } from "./seed";
import type { Content } from "./schemas";

const SITE = "https://example.com";
const c: Content = {
  ...seedContent,
  profile: { ...seedContent.profile, name: "Jane Doe", title: "Software Engineer", email: "jane@example.com", phone: "+1 555 0100", location: "Colombo, Sri Lanka" },
  education: [{ id: "e1", school: "University of Moratuwa", degree: "BSc Computer Science", period: "2018 - 2022", details: "First class." }],
};

describe("normalizeSiteUrl / absoluteUrl", () => {
  test("prefers the configured value, strips trailing slashes, falls back to the request origin", () => {
    expect(normalizeSiteUrl("https://example.com/", "http://localhost:3000")).toBe("https://example.com");
    expect(normalizeSiteUrl(undefined, "http://localhost:3000/")).toBe("http://localhost:3000");
    expect(normalizeSiteUrl("   ", "http://localhost:3000")).toBe("http://localhost:3000");
  });
  test("builds absolute urls and leaves absolute ones alone", () => {
    expect(absoluteUrl(SITE, "/work")).toBe("https://example.com/work");
    expect(absoluteUrl(SITE, "uploads/a.png")).toBe("https://example.com/uploads/a.png");
    expect(absoluteUrl(SITE, "https://cdn.test/x.png")).toBe("https://cdn.test/x.png");
    expect(absoluteUrl(SITE, "demo.site")).toBe("https://example.com/demo.site");
  });
});

describe("llms.txt", () => {
  test("starts with the name as h1, a blockquote summary and lists pages with absolute links", () => {
    const t = llmsTxt(c, SITE);
    expect(t.startsWith("# Jane Doe\n")).toBe(true);
    expect(t).toMatch(/\n> .+/);
    expect(t).toContain("[Work](https://example.com/work)");
    expect(t).toContain("[Full content](https://example.com/llms-full.txt)");
  });
  test("lists every project title", () => {
    const t = llmsTxt(c, SITE);
    for (const p of c.projects) expect(t).toContain(p.title);
  });
  test("full version includes experience, skills, education, projects and faq", () => {
    const t = llmsFullTxt(c, SITE);
    expect(t).toContain("## Experience");
    expect(t).toContain(c.experience[0]!.company);
    expect(t).toContain("## Skills");
    expect(t).toContain("## Education");
    expect(t).toContain("University of Moratuwa");
    expect(t).toContain("## Projects");
    expect(t).toContain("## FAQ");
    expect(t).toContain("jane@example.com");
  });
  test("omits empty sections", () => {
    const t = llmsFullTxt({ ...c, education: [], faq: [] }, SITE);
    expect(t).not.toContain("## Education");
    expect(t).not.toContain("## FAQ");
  });
});

describe("sitemap and robots", () => {
  test("sitemap lists the public pages, never admin or api", () => {
    const x = sitemapXml(SITE);
    expect(x).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    for (const p of ["", "/work", "/services", "/contact"]) expect(x).toContain(`<loc>https://example.com${p}</loc>`);
    expect(x).not.toContain("/admin");
    expect(x).not.toContain("/api");
  });
  test("robots allows the site, blocks admin and api, and points at the sitemap", () => {
    const r = robotsTxt(SITE);
    expect(r).toContain("User-agent: *");
    expect(r).toContain("Disallow: /admin");
    expect(r).toContain("Disallow: /api/");
    expect(r).toContain("Sitemap: https://example.com/sitemap.xml");
    expect(r).toContain("Allow: /llms.txt");
  });
});

describe("json-ld", () => {
  test("person has identity, links, skills and education", () => {
    const p = personJsonLd(c, SITE) as Record<string, any>;
    expect(p["@context"]).toBe("https://schema.org");
    expect(p["@type"]).toBe("Person");
    expect(p.name).toBe("Jane Doe");
    expect(p.jobTitle).toBe("Software Engineer");
    expect(p.email).toBe("mailto:jane@example.com");
    expect(p.image).toMatch(/^https:\/\/example\.com\//);
    expect(p.sameAs.every((u: string) => /^https?:\/\//.test(u))).toBe(true);
    expect(p.knowsAbout).toContain(c.stack[0]!.title);
    expect(p.alumniOf[0].name).toBe("University of Moratuwa");
  });
  test("projects become an ItemList of CreativeWork with absolute urls", () => {
    const l = projectsJsonLd(c, SITE) as Record<string, any>;
    expect(l["@type"]).toBe("ItemList");
    expect(l.itemListElement).toHaveLength(c.projects.length);
    expect(l.itemListElement[0].item.url).toMatch(/^https?:\/\//);
  });
  test("faq becomes FAQPage", () => {
    const f = faqJsonLd(c) as Record<string, any>;
    expect(f["@type"]).toBe("FAQPage");
    expect(f.mainEntity[0].acceptedAnswer.text).toBe(c.faq[0]!.answer);
  });
  test("jsonLdScript cannot break out of a script tag", () => {
    const s = jsonLdScript({ name: "</script><script>alert(1)</script>" });
    expect(s).not.toContain("</script>");
    expect(JSON.parse(s).name).toBe("</script><script>alert(1)</script>");
  });
});
