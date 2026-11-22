import { existsSync } from "node:fs";
import { ZodError } from "zod";
import { resolveUploadPath } from "../../../lib/uploads";
import { sectionKeys, type SectionKey } from "../../../lib/schemas";

export default defineEventHandler(async (event) => {
  const section = getRouterParam(event, "section") as SectionKey;
  if (!sectionKeys.includes(section)) throw createError({ statusCode: 404, statusMessage: "Unknown section" });

  const store = useStore();
  const body = await readBody(event).catch(() => undefined);

  // The CV upload must point at a PDF we actually stored.
  const cvUrl = section === "settings" ? (body as { cvUploadUrl?: unknown } | undefined)?.cvUploadUrl : null;
  if (typeof cvUrl === "string") {
    const file = cvUrl.startsWith("/uploads/") ? resolveUploadPath(store.dataDir, cvUrl.slice("/uploads/".length)) : null;
    if (!file || !file.endsWith(".pdf") || !existsSync(file)) {
      throw createError({ statusCode: 400, statusMessage: "cvUploadUrl must reference an uploaded PDF" });
    }
  }

  try {
    return store.saveSection(section, body);
  } catch (err) {
    if (err instanceof ZodError) {
      setResponseStatus(event, 400);
      return { message: "Validation failed", issues: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })) };
    }
    throw err;
  }
});
