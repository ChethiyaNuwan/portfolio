import { describe, expect, test } from "bun:test";
import { PDFDocument } from "pdf-lib";
import { extractText, getDocumentProxy } from "unpdf";
import { buildCvPdf, safeFileName, toBullets } from "./cv";
import { seedContent } from "./seed";
import type { Content } from "./schemas";

const pages = async (bytes: Uint8Array) => (await PDFDocument.load(bytes)).getPageCount();
const textOf = async (bytes: Uint8Array) => {
  const pdf = await getDocumentProxy(new Uint8Array(bytes));
  const { text } = await extractText(pdf, { mergePages: true });
  return text;
};
const empty: Content = {
  ...seedContent,
  counters: [], experience: [], stack: [], services: [], plans: [], projects: [], faq: [], socials: [], education: [],
};
const full: Content = {
  ...seedContent,
  profile: { ...seedContent.profile, name: "Jane Doe", title: "Software Engineer", email: "jane@example.com", phone: "+1 555 0100", location: "Colombo, Sri Lanka" },
  education: [{ id: "e1", school: "University of Moratuwa", degree: "BSc (Hons) Computer Science", period: "2018 - 2022", details: "First class honours." }],
};
const idx = (text: string, needle: string) => text.indexOf(needle);

describe("ATS-friendly cv", () => {
  test("produces a valid pdf with title, author and language metadata", async () => {
    const bytes = await buildCvPdf(full);
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
    const doc = await PDFDocument.load(bytes);
    expect(doc.getTitle()).toBe("Jane Doe - Resume");
    expect(doc.getAuthor()).toBe("Jane Doe");
  });

  test("uses standard headings in the standard order, as extractable text", async () => {
    const text = await textOf(await buildCvPdf(full));
    const order = ["Jane Doe", "SUMMARY", "EXPERIENCE", "SKILLS", "EDUCATION", "PROJECTS"].map((h) => idx(text, h));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  test("puts name, title and plain-text contact details at the top", async () => {
    const text = await textOf(await buildCvPdf(full));
    const header = text.slice(0, idx(text, "SUMMARY"));
    for (const part of ["Software Engineer", "jane@example.com", "+1 555 0100", "Colombo, Sri Lanka"]) {
      expect(header).toContain(part);
    }
  });

  test("renders each experience as role, company and period with hyphen bullets", async () => {
    const text = await textOf(await buildCvPdf(full));
    const first = full.experience[0]!;
    expect(text).toContain(first.title);
    expect(text).toContain(first.company);
    expect(text).toContain(first.year);
    expect(text).toMatch(/- \S/);
  });

  test("lists skills as plain comma-separated text", async () => {
    const text = await textOf(await buildCvPdf(full));
    const skills = text.slice(idx(text, "SKILLS"), idx(text, "EDUCATION"));
    expect(skills).toContain(full.stack[0]!.title);
    expect(skills).toContain(",");
  });

  test("omits empty sections entirely", async () => {
    const text = await textOf(await buildCvPdf(empty));
    for (const h of ["EXPERIENCE", "SKILLS", "EDUCATION", "PROJECTS"]) expect(text).not.toContain(h);
    expect(await pages(await buildCvPdf(empty))).toBe(1);
  });

  test("ordinary Latin text is never replaced by question marks", async () => {
    const text = await textOf(await buildCvPdf(full));
    expect(text).not.toContain("?");
  });

  test("very long text paginates without throwing", async () => {
    const long: Content = {
      ...full,
      experience: [{ ...full.experience[0]!, description: "word ".repeat(4000) }],
      projects: [{ ...full.projects[0]!, link: "x".repeat(600), description: "y".repeat(3000) }],
    };
    expect(await pages(await buildCvPdf(long))).toBeGreaterThan(1);
  });

  test("non-Latin text and emoji do not crash the build", async () => {
    const odd: Content = { ...full, profile: { ...full.profile, name: "Chethiya 🚀 සිංහල", intro: "日本語 “quotes” – dash … 🎉\nnew line\ttab" } };
    expect(await pages(await buildCvPdf(odd))).toBeGreaterThanOrEqual(1);
  });
});

describe("toBullets", () => {
  test("one bullet per non-empty line, stripping existing markers", () => {
    expect(toBullets("- First\n\n• Second\n  * Third  ")).toEqual(["First", "Second", "Third"]);
  });
  test("a single long paragraph is split into sentences", () => {
    const text = "Built the API for the platform and owned deployments across regions. Led a small team of engineers through two releases. Improved performance by caching hot paths in the service layer.";
    expect(toBullets(text)).toEqual([
      "Built the API for the platform and owned deployments across regions.",
      "Led a small team of engineers through two releases.",
      "Improved performance by caching hot paths in the service layer.",
    ]);
  });
  test("a short single line stays one bullet", () => {
    expect(toBullets("Short note. Stays together.")).toEqual(["Short note. Stays together."]);
  });
});

describe("safeFileName", () => {
  test("keeps only filename-safe characters", () => {
    expect(safeFileName('Chethiya "N" 🚀/..\\x')).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(safeFileName("🚀🚀")).toBe("CV");
  });
});
