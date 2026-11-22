import { z } from "zod";

const short = z.string().trim().max(200);
const long = z.string().trim().max(4000);
const url = z.string().trim().max(2000);
const id = z.string().trim().min(1).max(64);

export const socialIcons = ["github", "linkedin", "instagram", "newspaper", "mail"] as const;

export const sectionSchemas = {
  profile: z.object({
    name: short.min(1),
    title: short,
    intro: long,
    email: z.email().max(200),
    avatar: url,
    phone: short.default(""),
    location: short.default(""),
  }),
  counters: z.array(z.object({ id, title: short, value: z.number().int().min(0).max(1_000_000) })).max(20),
  experience: z
    .array(
      z.object({
        id,
        year: short,
        title: short,
        company: short,
        labels: z.array(short).max(20),
        description: long,
        link: url,
        logo: url,
      }),
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
      }),
    )
    .max(100),
  gallery: z
    .array(z.object({ id, image: url.min(1), caption: short.default(""), tags: z.array(short).max(20).default([]) }))
    .max(300),
  education: z
    .array(z.object({ id, school: short, degree: short, period: short, details: long.default("") }))
    .max(30),
  faq: z.array(z.object({ id, question: short, answer: long })).max(100),
  socials: z
    .array(z.object({ id, title: short, icon: z.enum(socialIcons), link: url }))
    .max(30),
  settings: z.object({
    cvMode: z.enum(["uploaded", "generated"]),
    cvUploadUrl: url.nullable(),
  }),
} as const;

export type SectionKey = keyof typeof sectionSchemas;
export const sectionKeys = Object.keys(sectionSchemas) as SectionKey[];
export type Content = { [K in SectionKey]: z.infer<(typeof sectionSchemas)[K]> };
export type PublicContent = Omit<Content, "settings">;
