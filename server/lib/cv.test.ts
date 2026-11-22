import { describe, expect, test } from "bun:test";
import { PDFDocument } from "pdf-lib";
import { buildCvPdf, safeFileName } from "./cv";
import { seedContent } from "./seed";
import type { Content } from "./schemas";

const pages = async (bytes: Uint8Array) => (await PDFDocument.load(bytes)).getPageCount();
const empty: Content = {
  ...seedContent,
  counters: [], experience: [], stack: [], services: [], plans: [], projects: [], faq: [], socials: [],
};

describe("buildCvPdf", () => {
  test("produces a valid pdf from seed content", async () => {
    const bytes = await buildCvPdf(seedContent);
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
    expect(await pages(bytes)).toBeGreaterThanOrEqual(1);
  });

  test("builds when every list section is empty", async () => {
    const bytes = await buildCvPdf(empty);
    expect(await pages(bytes)).toBe(1);
  });

  test("very long text paginates without throwing", async () => {
    const long: Content = {
      ...seedContent,
      experience: [{ ...seedContent.experience[0]!, description: "word ".repeat(4000) }],
      projects: [{ ...seedContent.projects[0]!, link: "x".repeat(600), description: "y".repeat(3000) }],
    };
    expect(await pages(await buildCvPdf(long))).toBeGreaterThan(1);
  });

  test("non-Latin text and emoji do not crash the build", async () => {
    const odd: Content = {
      ...seedContent,
      profile: { ...seedContent.profile, name: "Chethiya 🚀 සිංහල", intro: "日本語 “quotes” – dash … 🎉\nnew line\ttab" },
    };
    const bytes = await buildCvPdf(odd);
    expect(await pages(bytes)).toBeGreaterThanOrEqual(1);
  });
});

describe("safeFileName", () => {
  test("keeps only filename-safe characters", () => {
    expect(safeFileName('Chethiya "N" 🚀/..\\x')).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(safeFileName("🚀🚀")).toBe("CV");
  });
});
