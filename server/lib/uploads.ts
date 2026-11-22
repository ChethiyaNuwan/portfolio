import { randomUUID } from "node:crypto";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

export type FileType = "png" | "jpeg" | "webp" | "avif" | "gif" | "pdf";
export type UploadKind = "image" | "pdf";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_PDF_BYTES = 10 * 1024 * 1024;

export class UploadError extends Error {
  constructor(message: string, public status: 400 | 413) {
    super(message);
  }
}

const startsWith = (b: Uint8Array, sig: number[], offset = 0) => sig.every((v, i) => b[offset + i] === v);
const text = (b: Uint8Array, start: number, end: number) => new TextDecoder("latin1").decode(b.slice(start, end));

/** Decide the type from the content itself; names and MIME headers are never trusted. */
export function sniffType(b: Uint8Array): FileType | null {
  if (startsWith(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (startsWith(b, [0xff, 0xd8, 0xff])) return "jpeg";
  if (text(b, 0, 6) === "GIF87a" || text(b, 0, 6) === "GIF89a") return "gif";
  if (text(b, 0, 4) === "RIFF" && text(b, 8, 12) === "WEBP") return "webp";
  if (text(b, 4, 8) === "ftyp" && ["avif", "avis"].includes(text(b, 8, 12))) return "avif";
  if (text(b, 0, 5) === "%PDF-") return "pdf";
  return null;
}

const EXT: Record<FileType, string> = { png: "png", jpeg: "jpg", webp: "webp", avif: "avif", gif: "gif", pdf: "pdf" };

export function saveUpload(dataDir: string, buf: Uint8Array, kind: UploadKind): { url: string; type: FileType } {
  const type = sniffType(buf);
  if (!type || (kind === "pdf") !== (type === "pdf")) {
    throw new UploadError(kind === "pdf" ? "File must be a PDF" : "File must be a PNG, JPEG, WebP, AVIF or GIF image", 400);
  }
  const limit = kind === "pdf" ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;
  if (buf.byteLength > limit) throw new UploadError(`File too large (max ${limit / 1024 / 1024} MB)`, 413);

  const name = `${randomUUID()}.${EXT[type]}`;
  writeFileSync(join(dataDir, "uploads", name), buf, { flag: "wx" });
  return { url: `/uploads/${name}`, type };
}

const NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpg|webp|avif|gif|pdf)$/;

/** Maps a requested filename to a path inside uploads/, or null if it is not one we generated. */
export function resolveUploadPath(dataDir: string, requested: string): string | null {
  return NAME.test(requested) ? join(dataDir, "uploads", requested) : null;
}
