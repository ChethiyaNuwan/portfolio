import { describe, expect, test } from "bun:test";
import { sectionSchemas } from "./schemas";
import { seedContent } from "./seed";

describe("content schemas", () => {
  test("seed content satisfies every section schema", () => {
    for (const [key, schema] of Object.entries(sectionSchemas)) {
      const result = schema.safeParse((seedContent as Record<string, unknown>)[key]);
      expect(result.success, `section ${key}`).toBe(true);
    }
  });

  test("projects reject non-numeric pages", () => {
    const bad = seedContent.projects.map((p) => ({ ...p, pages: "x" }));
    expect(sectionSchemas.projects.safeParse(bad).success).toBe(false);
  });

  test("settings reject unknown cvMode", () => {
    expect(sectionSchemas.settings.safeParse({ cvMode: "pdf", cvUploadUrl: null }).success).toBe(false);
  });

  test("socials reject unknown icon", () => {
    const bad = [{ id: "1", title: "x", icon: "tiktok", link: "https://x.test" }];
    expect(sectionSchemas.socials.safeParse(bad).success).toBe(false);
  });

  test("description over 4000 chars is rejected", () => {
    const bad = seedContent.faq.map((f) => ({ ...f, answer: "a".repeat(5000) }));
    expect(sectionSchemas.faq.safeParse(bad).success).toBe(false);
  });
});
