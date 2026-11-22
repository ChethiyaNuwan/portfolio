import { MAX_PDF_BYTES, saveUpload, UploadError, type UploadKind } from "../../lib/uploads";

// Admin-only (session + CSRF enforced by middleware/guard.ts).
export default defineEventHandler(async (event) => {
  const kind: UploadKind = getQuery(event).kind === "pdf" ? "pdf" : "image";

  const declared = Number(getHeader(event, "content-length") ?? 0);
  if (declared > MAX_PDF_BYTES + 1024 * 1024) throw createError({ statusCode: 413, statusMessage: "File too large" });

  const parts = await readMultipartFormData(event);
  const file = parts?.find((p) => p.name === "file" && p.data);
  if (!file) throw createError({ statusCode: 400, statusMessage: "Missing file field" });

  try {
    const { url } = saveUpload(useStore().dataDir, file.data, kind);
    return { url };
  } catch (err) {
    if (err instanceof UploadError) throw createError({ statusCode: err.status, statusMessage: err.message });
    throw err;
  }
});
