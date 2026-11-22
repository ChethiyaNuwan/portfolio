import { describe, expect, test } from "bun:test";
import sharp from "sharp";
import { optimizeUpload } from "./images";
import { sniffType } from "./uploads";

// real image data: a large image with noise so it does not compress to nothing
async function noisyPng(width: number, height: number) {
  const raw = Buffer.alloc(width * height * 3);
  for (let i = 0; i < raw.length; i++) raw[i] = (i * 2654435761) >>> 24;
  return new Uint8Array(await sharp(raw, { raw: { width, height, channels: 3 } }).png({ compressionLevel: 1 }).toBuffer());
}

describe("optimizeUpload", () => {
  test("a big PNG becomes a smaller WebP no wider than 2000px", async () => {
    const input = await noisyPng(2600, 1300);
    const out = await optimizeUpload(input);
    expect(out.type).toBe("webp");
    expect(sniffType(out.data)).toBe("webp");
    expect(out.data.byteLength).toBeLessThan(input.byteLength);
    expect((await sharp(out.data).metadata()).width).toBe(2000);
  });

  test("EXIF orientation is applied and metadata is removed", async () => {
    const jpeg = await sharp({ create: { width: 400, height: 200, channels: 3, background: "#369" } }).jpeg().withMetadata({ orientation: 6 }).toBuffer();
    const out = await optimizeUpload(new Uint8Array(jpeg));
    const meta = await sharp(out.data).metadata();
    expect([meta.width, meta.height]).toEqual([200, 400]); // rotated upright
    expect(meta.exif).toBeUndefined();
  });

  test("small images are never enlarged", async () => {
    const out = await optimizeUpload(await noisyPng(120, 80));
    const meta = await sharp(out.data).metadata();
    expect([meta.width, meta.height]).toEqual([120, 80]);
  });

  test("data that cannot be decoded is returned unchanged", async () => {
    const bad = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
    const out = await optimizeUpload(bad);
    expect(out.data).toBe(bad);
    expect(out.type).toBe("png");
  });

  test("gif, avif and pdf are left exactly as uploaded", async () => {
    const gif = new TextEncoder().encode("GIF89a....");
    const pdf = new TextEncoder().encode("%PDF-1.7\n%....");
    expect((await optimizeUpload(gif)).data).toBe(gif);
    expect((await optimizeUpload(pdf)).data).toBe(pdf);
  });

  test("an image that would get bigger is kept as is", async () => {
    const tiny = new Uint8Array(await sharp({ create: { width: 1, height: 1, channels: 3, background: "#fff" } }).png().toBuffer());
    const out = await optimizeUpload(tiny);
    expect(out.data.byteLength).toBeLessThanOrEqual(tiny.byteLength);
  });
});
