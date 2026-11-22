import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { buildCvPdf, safeFileName } from "../lib/cv";
import { resolveUploadPath } from "../lib/uploads";

let cache: { version: number; bytes: Uint8Array } | undefined;

// Serves the uploaded PDF, or one generated from the current content (cached until content changes).
export default defineEventHandler(async (event) => {
  const store = useStore();
  const { settings, profile } = store.getContent();

  let bytes: Uint8Array | undefined;
  if (settings.cvMode === "uploaded" && settings.cvUploadUrl) {
    const file = resolveUploadPath(store.dataDir, settings.cvUploadUrl.replace(/^\/uploads\//, ""));
    if (file && existsSync(file)) bytes = await readFile(file);
  }
  if (!bytes) {
    const version = store.version();
    if (!cache || cache.version !== version) cache = { version, bytes: await buildCvPdf(store.getContent()) };
    bytes = cache.bytes;
  }

  setHeaders(event, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename="${safeFileName(profile.name)}_Resume.pdf"`,
    "Cache-Control": "no-cache",
  });
  return bytes;
});
