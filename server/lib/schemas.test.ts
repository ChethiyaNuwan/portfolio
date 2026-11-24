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
  test("the education section exists and the seed satisfies it", () => {
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

describe("theme accent", () => {
  test("accepts two hex colours and rejects anything else", () => {
    expect(sectionSchemas.theme.safeParse({ accentDark: "#ff7a1a", accentLight: "#d6006f" }).success).toBe(true);
    expect(sectionSchemas.theme.safeParse({ accentDark: "red", accentLight: "#d6006f" }).success).toBe(false);
    expect(sectionSchemas.theme.safeParse({ accentDark: "#fff", accentLight: "#d6006f" }).success).toBe(false);
    expect(sectionSchemas.theme.safeParse(seedContent.theme).success).toBe(true);
  });
});

describe("sections", () => {
  test("old data without sections gets every section in the default order", () => {
    const parsed = sectionSchemas.sections.parse(undefined);
    expect(parsed.map((s) => s.id)).toEqual(["intro", "work", "experience", "stack", "services", "contact"]);
  });
  test("keeps the saved order, adds missing sections, drops unknown ones", () => {
    const parsed = sectionSchemas.sections.parse([{ id: "contact", label: "Hire me", visible: true }, { id: "nope", label: "x", visible: true }, { id: "intro", label: "Hi", visible: false }]);
    expect(parsed.map((s) => s.id).slice(0, 2)).toEqual(["contact", "intro"]);
    expect(parsed).toHaveLength(6);
  });
  test("at least one section must stay shown", () => {
    const hidden = ["intro", "work", "experience", "stack", "services", "contact"].map((id) => ({ id, label: id, visible: false }));
    expect(sectionSchemas.sections.safeParse(hidden).success).toBe(false);
  });
});
