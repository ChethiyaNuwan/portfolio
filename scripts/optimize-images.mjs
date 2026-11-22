// Shrinks oversized images in public/ in place (same file names, so nothing that references them changes).
// Usage: bun scripts/optimize-images.mjs [--dry]
// JPEGs are resized to 1280px wide and re-encoded; PNGs to 1400px wide as palette PNGs. Files under 300 KB are left alone.
import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";
import sharp from "sharp";

const DIR = new URL("../public/", import.meta.url).pathname;
const LIMIT = 300 * 1024;
const dry = process.argv.includes("--dry");
let before = 0;
let after = 0;

for (const name of readdirSync(DIR)) {
  const ext = extname(name).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;
  const path = join(DIR, name);
  const size = statSync(path).size;
  if (size < LIMIT) continue;

  const input = readFileSync(path);
  const base = sharp(input).rotate();
  const out =
    ext === ".png"
      ? await base.resize({ width: 1400, withoutEnlargement: true }).png({ palette: true, quality: 80, effort: 10, compressionLevel: 9 }).toBuffer()
      : await base.resize({ width: 1280, withoutEnlargement: true }).jpeg({ quality: 74, mozjpeg: true }).toBuffer();

  if (out.length >= size) {
    console.log(`skip   ${name} (already smaller than the result)`);
    continue;
  }
  before += size;
  after += out.length;
  console.log(`${dry ? "would " : ""}shrink ${name}: ${Math.round(size / 1024)} KB -> ${Math.round(out.length / 1024)} KB`);
  if (!dry) writeFileSync(path, out);
}
console.log(`total: ${Math.round(before / 1024)} KB -> ${Math.round(after / 1024)} KB`);
