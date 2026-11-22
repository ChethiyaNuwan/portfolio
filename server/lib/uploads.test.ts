import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolveUploadPath, saveUpload, sniffType, UploadError } from "./uploads";

const bytes = (...b: number[]) => Uint8Array.from(b);
const ascii = (s: string) => new TextEncoder().encode(s);
const PNG = bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0);
const JPEG = bytes(0xff, 0xd8, 0xff, 0xe0, 0, 0x10);
const GIF = ascii("GIF89a....");
const WEBP = ascii("RIFF\0\0\0\0WEBPVP8 ");
const AVIF = ascii("\0\0\0\x1cftypavif\0\0\0\0");
const PDF = ascii("%PDF-1.7\n%....");
const pad = (head: Uint8Array, total: number) => {
  const out = new Uint8Array(total);
  out.set(head);
  return out;
};

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "uploads-"));
  mkdirSync(join(dir, "uploads"));
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe("sniffType", () => {
  test("identifies allowed formats by magic bytes", () => {
    expect(sniffType(PNG)).toBe("png");
    expect(sniffType(JPEG)).toBe("jpeg");
    expect(sniffType(GIF)).toBe("gif");
    expect(sniffType(WEBP)).toBe("webp");
    expect(sniffType(AVIF)).toBe("avif");
    expect(sniffType(PDF)).toBe("pdf");
  });
  test("rejects html, svg, exe and empty input", () => {
    expect(sniffType(ascii("<html><script>alert(1)</script>"))).toBeNull();
    expect(sniffType(ascii('<svg xmlns="http://www.w3.org/2000/svg"/>'))).toBeNull();
    expect(sniffType(ascii("MZ\x90\x00"))).toBeNull();
    expect(sniffType(new Uint8Array())).toBeNull();
  });
});

describe("saveUpload", () => {
  test("stores a valid png under uploads/ with a random name", () => {
    const { url, type } = saveUpload(dir, PNG, "image");
    expect(type).toBe("png");
    expect(url).toMatch(/^\/uploads\/[0-9a-f-]{36}\.png$/);
    expect(existsSync(join(dir, url))).toBe(true);
  });
  test("rejects html content regardless of claimed name", () => {
    expect(() => saveUpload(dir, ascii("<html></html>"), "image")).toThrow(UploadError);
    expect(readdirSync(join(dir, "uploads"))).toHaveLength(0);
  });
  test("rejects a pdf for kind image and an image for kind pdf", () => {
    expect(() => saveUpload(dir, PDF, "image")).toThrow(UploadError);
    expect(() => saveUpload(dir, PNG, "pdf")).toThrow(UploadError);
  });
  test("enforces size limits with 413", () => {
    const big = (fn: () => unknown) => {
      try { fn(); } catch (e) { return (e as UploadError).status; }
    };
    expect(big(() => saveUpload(dir, pad(PNG, 6 * 1024 * 1024), "image"))).toBe(413);
    expect(big(() => saveUpload(dir, pad(PDF, 11 * 1024 * 1024), "pdf"))).toBe(413);
    expect(readdirSync(join(dir, "uploads"))).toHaveLength(0);
  });
});

describe("resolveUploadPath", () => {
  const name = "123e4567-e89b-12d3-a456-426614174000.png";
  test("accepts a generated filename", () => {
    expect(resolveUploadPath(dir, name)).toBe(join(dir, "uploads", name));
  });
  test("rejects traversal, absolute, dotfiles and nested paths", () => {
    for (const bad of ["../x.png", "..%2fx", "/etc/passwd", ".env", `a/${name}`, `${name}/..`, `${name}.html`, ""]) {
      expect(resolveUploadPath(dir, bad), bad).toBeNull();
    }
  });
});
