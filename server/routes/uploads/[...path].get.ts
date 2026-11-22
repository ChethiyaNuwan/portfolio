import { readFile } from "node:fs/promises";
import { resolveUploadPath } from "../../lib/uploads";

const TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  pdf: "application/pdf",
};

export default defineEventHandler(async (event) => {
  const requested = decodeURIComponent(getRouterParam(event, "path") ?? "");
  const file = resolveUploadPath(useStore().dataDir, requested);
  if (!file) throw createError({ statusCode: 404, statusMessage: "Not found" });

  const data = await readFile(file).catch(() => null);
  if (!data) throw createError({ statusCode: 404, statusMessage: "Not found" });

  setHeaders(event, {
    "Content-Type": TYPES[requested.split(".").pop()!] ?? "application/octet-stream",
    "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Security-Policy": "default-src 'none'; sandbox",
  });
  return data;
});
