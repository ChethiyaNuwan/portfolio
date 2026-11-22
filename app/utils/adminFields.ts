export type FieldType = "text" | "textarea" | "number" | "image" | "select" | "tags";
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
  profile: { label: "Profile", kind: "object", fields: [t("name", "Name"), t("title", "Job title"), area("intro", "Intro"), t("email", "Email (used for mailto: links)"), img("avatar", "Avatar")] },
  counters: { label: "Counters", kind: "list", itemLabel: "title", fields: [t("title", "Title"), { key: "value", label: "Value", type: "number" }] },
  experience: {
    label: "Experience", kind: "list", itemLabel: "company",
    fields: [t("company", "Company"), t("title", "Role"), t("year", "Period"), { key: "labels", label: "Labels", type: "tags" }, area("description", "Description"), t("link", "Link"), img("logo", "Logo")],
  },
  stack: { label: "Stack", kind: "list", itemLabel: "title", fields: [t("title", "Title"), area("description", "Description"), img("logo", "Logo"), t("link", "Link")] },
  services: { label: "Services", kind: "list", itemLabel: "title", fields: [t("title", "Title"), area("description", "Description"), img("icon", "Icon"), t("link", "Link")] },
  plans: {
    label: "Service plans", kind: "list", itemLabel: "service",
    fields: [t("service", "Service"), area("description", "Description"), t("completedWorks", "Completed works"), t("experience", "Experience"), img("icon", "Icon")],
  },
  projects: {
    label: "Projects", kind: "list", itemLabel: "title",
    fields: [t("title", "Title"), area("description", "Description"), t("link", "Domain (without https://)"), t("type", "Type"), t("theme", "Theme"), { key: "pages", label: "Pages", type: "number" }, img("image", "Screenshot")],
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
  for (const f of sectionConfigs[section]!.fields) {
    item[f.key] = f.type === "number" ? 0 : f.type === "tags" ? [] : f.type === "select" ? f.options![0] : "";
  }
  return item;
}
