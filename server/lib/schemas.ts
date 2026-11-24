import { z } from "zod";
import { formatPeriod, parsePeriodText } from "./period";

const short = z.string().trim().max(200);
const long = z.string().trim().max(4000);
const url = z.string().trim().max(2000);
const id = z.string().trim().min(1).max(64);

export const socialIcons = ["github", "linkedin", "instagram", "newspaper", "mail"] as const;

/** the sections of the home page, in their default order, with their default names in the navigation */
export const panelDefaults = [
  { id: "intro", label: "Intro" },
  { id: "work", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
] as const;
const panelIds = panelDefaults.map((p) => p.id) as [string, ...string[]];

export const sectionSchemas = {
  profile: z.object({
    name: short.min(1),
    title: short,
    intro: long,
    email: z.email().max(200),
    avatar: url,
    avatarMobile: url.default(""),
    /** words in the big scrolling band on the home page; empty = job title and service names */
    marquee: z.array(short).max(20).default([]),
    phone: short.default(""),
    location: short.default(""),
  }),
  counters: z.array(z.object({ id, title: short, value: z.number().int().min(0).max(1_000_000) })).max(20),
  experience: z
    .array(
      z
        .preprocess(
          // entries saved before dates were structured only have the text: read the dates out of it
          (raw) => {
            const e = raw as Record<string, unknown>;
            if (e && typeof e === "object" && e.startYear === undefined) return { ...e, ...parsePeriodText(typeof e.year === "string" ? e.year : "") };
            return raw;
          },
          z.object({
        id,
        year: short.default(""),
        startYear: z.number().int().min(1950).max(2100),
        startMonth: z.number().int().min(0).max(12).default(0),
        endYear: z.number().int().min(1950).max(2100),
        endMonth: z.number().int().min(0).max(12).default(0),
        present: z.boolean().default(false),
        showMonth: z.boolean().default(true),
        title: short,
        company: short,
        labels: z.array(short).max(20),
        description: long,
        link: url,
        logo: url,
          }),
        )
        // the readable text is always derived from the dates
        .transform((e) => ({ ...e, year: formatPeriod(e) })),
    )
    .max(100),
  stack: z
    .array(z.object({ id, title: short, description: long, logo: url, link: url }))
    .max(100),
  services: z
    .array(z.object({ id, title: short, description: long, icon: url, link: url }))
    .max(50),
  plans: z
    .array(
      z.object({
        id,
        service: short,
        description: long,
        completedWorks: short,
        experience: short,
        icon: url,
      }),
    )
    .max(50),
  projects: z
    .array(
      z.object({
        id,
        title: short,
        description: long,
        link: url,
        type: short,
        theme: short,
        pages: z.number().int().min(0).max(100_000),
        image: url,
        tags: z.array(short).max(20).default([]),
        gallery: z.array(url).max(30).default([]),
        /** ids of the stack items used in this project */
        stack: z.array(id).max(40).default([]),
      }),
    )
    .max(100),
  education: z
    .array(z.object({ id, school: short, degree: short, period: short, details: long.default("") }))
    .max(30),
  faq: z.array(z.object({ id, question: short, answer: long })).max(100),
  socials: z
    .array(z.object({ id, title: short, icon: z.enum(socialIcons), link: url }))
    .max(30),
  /** which sections the home page shows, in what order, and what each is called */
  sections: z.preprocess(
    (v) => {
      // keep the saved order, drop unknown or repeated entries, and add any section that is missing at the end
      const seen = new Set<string>();
      const out: { id: string; label: string; visible: boolean }[] = [];
      for (const s of Array.isArray(v) ? v : []) {
        if (!s || typeof s !== "object" || !panelIds.includes((s as { id: string }).id) || seen.has((s as { id: string }).id)) continue;
        seen.add((s as { id: string }).id);
        out.push(s as (typeof out)[number]);
      }
      for (const d of panelDefaults) if (!seen.has(d.id)) out.push({ id: d.id, label: d.label, visible: true });
      return out;
    },
    z
      .array(z.object({ id: z.enum(panelIds), label: short.min(1), visible: z.boolean().default(true) }))
      .refine((a) => a.some((s) => s.visible), "Keep at least one section shown"),
  ),
  /** the accent colour used across the site, set separately for dark and light mode */
  theme: z.object({
    accentDark: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a colour like #6f8bff"),
    accentLight: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a colour like #2447ff"),
  }),
  settings: z.object({
    cvMode: z.enum(["uploaded", "generated"]),
    cvUploadUrl: url.nullable(),
  }),
} as const;

export type SectionKey = keyof typeof sectionSchemas;
export const sectionKeys = Object.keys(sectionSchemas) as SectionKey[];
export type Content = { [K in SectionKey]: z.infer<(typeof sectionSchemas)[K]> };
export type PublicContent = Omit<Content, "settings">;
