import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from "pdf-lib";
import type { Content } from "./schemas";

// ATS-friendly layout: one column, real text only, standard section headings, no tables/images/icons.
const PAGE = { w: 595.28, h: 841.89, margin: 54 };
const INK = rgb(0, 0, 0);
const RULE = rgb(0.45, 0.45, 0.45);
const BULLET_INDENT = 11;

const REPLACEMENTS: Record<string, string> = {
  "‘": "'", "’": "'", "“": '"', "”": '"', "–": "-", "—": "-", "…": "...", "\t": " ", "•": "-",
};

/** Standard PDF fonts only cover Latin-1; map common punctuation and replace the rest with "?". */
export function pdfSafe(input: string): string {
  let out = "";
  for (const ch of input.normalize("NFC")) {
    const cp = ch.codePointAt(0)!;
    if (ch === "\n") out += "\n";
    else if (REPLACEMENTS[ch]) out += REPLACEMENTS[ch];
    else if ((cp >= 0x20 && cp <= 0x7e) || (cp >= 0xa0 && cp <= 0xff)) out += ch;
    else out += "?";
  }
  return out;
}

export function safeFileName(name: string): string {
  const cleaned = name.replace(/[^A-Za-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");
  return cleaned || "CV";
}

/** One bullet per non-empty line; a single long paragraph is split into its sentences. */
export function toBullets(text: string): string[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-•*–]\s*/, "").trim())
    .filter(Boolean);
  if (lines.length === 1 && lines[0]!.length > 160) {
    return lines[0]!.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  }
  return lines;
}

class Writer {
  page!: PDFPage;
  y = 0;
  constructor(private doc: PDFDocument, private regular: PDFFont, private bold: PDFFont) {
    this.newPage();
  }

  private newPage() {
    this.page = this.doc.addPage([PAGE.w, PAGE.h]);
    this.y = PAGE.h - PAGE.margin;
  }

  private wrap(text: string, font: PDFFont, size: number, max: number): string[] {
    const lines: string[] = [];
    for (const paragraph of pdfSafe(text).split("\n")) {
      let line = "";
      for (const word of paragraph.split(/ +/)) {
        // break words that are wider than a whole line (long URLs etc.)
        const pieces: string[] = [];
        let rest = word;
        while (rest && font.widthOfTextAtSize(rest, size) > max) {
          let lo = 1;
          let hi = rest.length;
          while (lo < hi) {
            const mid = Math.ceil((lo + hi) / 2);
            if (font.widthOfTextAtSize(rest.slice(0, mid), size) <= max) lo = mid;
            else hi = mid - 1;
          }
          pieces.push(rest.slice(0, lo));
          rest = rest.slice(lo);
        }
        pieces.push(rest);
        for (const piece of pieces) {
          const candidate = line ? `${line} ${piece}` : piece;
          if (font.widthOfTextAtSize(candidate, size) <= max) line = candidate;
          else {
            if (line) lines.push(line);
            line = piece;
          }
        }
      }
      lines.push(line);
    }
    return lines;
  }

  private draw(lines: string[], opts: { size: number; bold?: boolean; x: number; prefix?: string }) {
    const font = opts.bold ? this.bold : this.regular;
    const lead = opts.size * 1.4;
    lines.forEach((line, i) => {
      if (this.y - lead < PAGE.margin) this.newPage();
      this.y -= lead;
      if (i === 0 && opts.prefix) this.page.drawText(opts.prefix, { x: PAGE.margin, y: this.y, size: opts.size, font: this.regular, color: INK });
      if (line) this.page.drawText(line, { x: opts.x, y: this.y, size: opts.size, font, color: INK });
    });
  }

  text(text: string, opts: { size?: number; bold?: boolean; gap?: number } = {}) {
    const size = opts.size ?? 10;
    const font = opts.bold ? this.bold : this.regular;
    this.draw(this.wrap(text, font, size, PAGE.w - PAGE.margin * 2), { size, bold: opts.bold, x: PAGE.margin });
    this.y -= opts.gap ?? 0;
  }

  bullet(text: string, size = 10) {
    const max = PAGE.w - PAGE.margin * 2 - BULLET_INDENT;
    this.draw(this.wrap(text, this.regular, size, max), { size, x: PAGE.margin + BULLET_INDENT, prefix: "-" });
  }

  heading(title: string) {
    if (this.y - 70 < PAGE.margin) this.newPage();
    this.y -= 10;
    this.text(title.toUpperCase(), { size: 11, bold: true });
    // rule sits below the heading's baseline (not through the text)
    this.page.drawLine({
      start: { x: PAGE.margin, y: this.y - 4 },
      end: { x: PAGE.w - PAGE.margin, y: this.y - 4 },
      thickness: 0.6,
      color: RULE,
    });
    this.y -= 4;
  }
}

export async function buildCvPdf(c: Content): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const name = pdfSafe(c.profile.name);
  doc.setTitle(`${name} - Resume`);
  doc.setAuthor(name);
  doc.setSubject("Resume");
  doc.setKeywords(c.stack.map((s) => pdfSafe(s.title)));
  doc.setCreator("Portfolio");
  doc.setProducer("Portfolio");
  doc.setLanguage("en-US");

  const w = new Writer(doc, await doc.embedFont(StandardFonts.Helvetica), await doc.embedFont(StandardFonts.HelveticaBold));

  w.text(c.profile.name, { size: 18, bold: true });
  const contact = [c.profile.title, c.profile.location, c.profile.phone, c.profile.email].filter(Boolean).join(" | ");
  if (contact) w.text(contact);
  const links = c.socials.map((s) => s.link).filter(Boolean).join(" | ");
  if (links) w.text(links);

  if (c.profile.intro.trim()) {
    w.heading("Summary");
    w.text(c.profile.intro, { gap: 2 });
  }

  if (c.experience.length) {
    w.heading("Experience");
    for (const e of c.experience) {
      w.text(e.title, { bold: true, size: 10.5 });
      w.text([e.company, e.year].filter(Boolean).join(" | "));
      for (const b of toBullets(e.description)) w.bullet(b);
      w.y -= 6;
    }
  }

  if (c.stack.length) {
    w.heading("Skills");
    w.text(c.stack.map((s) => s.title).join(", "), { gap: 2 });
  }

  if (c.education.length) {
    w.heading("Education");
    for (const e of c.education) {
      w.text(e.school, { bold: true, size: 10.5 });
      w.text([e.degree, e.period].filter(Boolean).join(" | "));
      for (const b of toBullets(e.details)) w.bullet(b);
      w.y -= 6;
    }
  }

  if (c.projects.length) {
    w.heading("Projects");
    for (const p of c.projects) {
      w.text(p.title, { bold: true, size: 10.5 });
      const meta = [p.link, p.type].filter(Boolean).join(" | ");
      if (meta) w.text(meta);
      for (const b of toBullets(p.description)) w.bullet(b);
      w.y -= 6;
    }
  }

  return doc.save();
}
