import { sniffType, type FileType } from "./uploads";

const MAX_SIDE = 2000;
const MAX_INPUT_PIXELS = 50_000_000; // refuse decompression bombs

export interface Optimized {
  data: Uint8Array;
  type: FileType;
}

/**
 * Makes an uploaded raster image lighter for visitors: applies the EXIF rotation, scales it down to at most
 * 2000px on the long side (never up), strips metadata (such as GPS), and re-encodes it as WebP.
 * GIF, AVIF and PDF are left alone. Anything that cannot be decoded, or would not get smaller, is returned unchanged.
 */
export async function optimizeUpload(data: Uint8Array): Promise<Optimized> {
  const type = sniffType(data);
  const original: Optimized = { data, type: type ?? "png" };
  if (type !== "png" && type !== "jpeg" && type !== "webp") return original;

  try {
    const { default: sharp } = await import("sharp");
    const out = await sharp(data, { limitInputPixels: MAX_INPUT_PIXELS })
      .rotate()
      .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    if (out.byteLength >= data.byteLength) return original;
    return { data: new Uint8Array(out), type: "webp" };
  } catch {
    return original;
  }
}
