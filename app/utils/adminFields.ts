export type FieldType = "text" | "textarea" | "number" | "image" | "imagelist" | "select" | "tags" | "period" | "stackpick";
export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
}
export interface SectionConfig {
  label: string;
  kind: "object" | "list";
  itemLabel?: string; // field used as the list item heading
  fields: FieldDef[];
}

const t = (key: string, label: string): FieldDef => ({ key, label, type: "text" });
const area = (key: string, label: string): FieldDef => ({ key, label, type: "textarea" });
const img = (key: string, label: string): FieldDef => ({ key, label, type: "image" });

export const sectionConfigs: Record<string, SectionConfig> = {
  profile: { label: "Profile", kind: "object", fields: [t("name", "Name"), t("title", "Job title"), area("intro", "Intro"), t("email", "Email (used for mailto: links)"), t("phone", "Phone (shown on CV)"), t("location", "Location (shown on CV)"), img("avatar", "Avatar"), img("avatarMobile", "Avatar for phones (optional, falls back to Avatar)"), { key: "marquee", label: "Scrolling words at the bottom of the home page (comma separated; empty = job title and service names)", type: "tags" }] },
  counters: { label: "Counters", kind: "list", itemLabel: "title", fields: [t("title", "Title"), { key: "value", label: "Value", type: "number" }] },
  experience: {
    label: "Experience", kind: "list", itemLabel: "company",
    fields: [t("company", "Company"), t("title", "Role"), { key: "startYear", label: "Dates", type: "period" }, { key: "labels", label: "Labels", type: "tags" }, area("description", "Description"), t("link", "Link"), img("logo", "Logo")],
  },
  stack: { label: "Stack", kind: "list", itemLabel: "title", fields: [t("title", "Title"), area("description", "Description"), img("logo", "Logo"), t("link", "Link")] },
  services: { label: "Services", kind: "list", itemLabel: "title", fields: [t("title", "Title"), area("description", "Description"), img("icon", "Icon"), t("link", "Link")] },
  plans: {
    label: "Service plans", kind: "list", itemLabel: "service",
    fields: [t("service", "Service"), area("description", "Description"), t("completedWorks", "Completed works"), t("experience", "Experience"), img("icon", "Icon")],
  },
  projects: {
    label: "Projects", kind: "list", itemLabel: "title",
    fields: [t("title", "Title"), area("description", "Description"), t("link", "Domain (without https://)"), t("type", "Type"), t("theme", "Theme"), { key: "pages", label: "Pages", type: "number" }, { key: "tags", label: "Tags", type: "tags" }, img("image", "Cover screenshot"), { key: "gallery", label: "More screenshots", type: "imagelist" }, { key: "stack", label: "Built with (pick from your stack)", type: "stackpick" }],
  },
  gallery: { label: "Gallery", kind: "list", itemLabel: "caption", fields: [img("image", "Image"), t("caption", "Caption"), { key: "tags", label: "Tags", type: "tags" }] },
  education: {
    label: "Education", kind: "list", itemLabel: "school",
    fields: [t("school", "School"), t("degree", "Degree / qualification"), t("period", "Period"), area("details", "Details (one point per line)")],
  },
  faq: { label: "FAQ", kind: "list", itemLabel: "question", fields: [t("question", "Question"), area("answer", "Answer")] },
  socials: {
    label: "Social links", kind: "list", itemLabel: "title",
    fields: [t("title", "Title"), { key: "icon", label: "Icon", type: "select", options: ["github", "linkedin", "instagram", "newspaper", "mail"] }, t("link", "URL")],
  },
};

export const sectionOrder = Object.keys(sectionConfigs);

export function blankItem(section: string): Record<string, unknown> {
  const item: Record<string, unknown> = { id: crypto.randomUUID() };
  if (section === "experience") {
    const y = new Date().getFullYear();
    Object.assign(item, { startYear: y, startMonth: 0, endYear: y, endMonth: 0, present: true, showMonth: false });
  }
  for (const f of sectionConfigs[section]!.fields) {
    if (f.type === "period") continue;
    item[f.key] = f.type === "number" ? 0 : f.type === "tags" || f.type === "imagelist" || f.type === "stackpick" ? [] : f.type === "select" ? f.options![0] : "";
  }
  return item;
}
