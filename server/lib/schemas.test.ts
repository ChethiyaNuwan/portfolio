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

describe("redesign content model", () => {
  test("gallery and education sections exist and the seed satisfies them", () => {
    expect(sectionSchemas.gallery.safeParse(seedContent.gallery).success).toBe(true);
    expect(seedContent.gallery.length).toBeGreaterThanOrEqual(4);
    expect(sectionSchemas.education.safeParse(seedContent.education).success).toBe(true);
  });

  test("old-format profile and projects parse with defaults for the new fields", () => {
    const { phone: _p, location: _l, ...oldProfile } = seedContent.profile;
    const parsedProfile = sectionSchemas.profile.parse(oldProfile);
    expect(parsedProfile.phone).toBe("");
    expect(parsedProfile.location).toBe("");

    const oldProjects = seedContent.projects.map(({ tags: _t, gallery: _g, ...rest }) => rest);
    const parsed = sectionSchemas.projects.parse(oldProjects);
    expect(parsed[0]!.tags).toEqual([]);
    expect(parsed[0]!.gallery).toEqual([]);
  });

  test("gallery items default caption and tags, and reject items without an image", () => {
    const ok = sectionSchemas.gallery.parse([{ id: "1", image: "/a.png" }]);
    expect(ok[0]).toEqual({ id: "1", image: "/a.png", caption: "", tags: [] });
    expect(sectionSchemas.gallery.safeParse([{ id: "1" }]).success).toBe(false);
  });
});

describe("structured experience dates", () => {
  const old = { id: "1", year: "Jan 2023 - Jun 2023", title: "Dev", company: "Acme", labels: [], description: "", link: "", logo: "" };

  test("an entry saved with only the text is read into dates", () => {
    const [e] = sectionSchemas.experience.parse([old]);
    expect(e).toMatchObject({ startYear: 2023, startMonth: 1, endYear: 2023, endMonth: 6, present: false, showMonth: true });
    expect(e!.year).toBe("Jan 2023 - Jun 2023");
  });

  test("the text is always derived from the dates, and hiding months drops them", () => {
    const [e] = sectionSchemas.experience.parse([{ ...old, year: "ignored", startYear: 2020, startMonth: 4, endYear: 2024, endMonth: 9, present: false, showMonth: false }]);
    expect(e!.year).toBe("2020 - 2024");
    const [p] = sectionSchemas.experience.parse([{ ...old, startYear: 2022, startMonth: 3, endYear: 2022, endMonth: 0, present: true, showMonth: true }]);
    expect(p!.year).toBe("Mar 2022 - Present");
  });

  test("an out-of-range year is rejected", () => {
    expect(sectionSchemas.experience.safeParse([{ ...old, startYear: 1800, endYear: 2000 }]).success).toBe(false);
  });

  test("projects take a list of stack ids and default to none; the marquee words default to empty", () => {
    expect(sectionSchemas.projects.parse([{ ...seedContent.projects[0]!, stack: undefined }])[0]!.stack).toEqual([]);
    expect(sectionSchemas.profile.parse({ ...seedContent.profile, marquee: undefined }).marquee).toEqual([]);
  });
});
