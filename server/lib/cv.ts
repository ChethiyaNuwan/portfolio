import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from "pdf-lib";
import type { Content } from "./schemas";

const PAGE = { w: 595.28, h: 841.89, margin: 50 };
const INK = rgb(0.1, 0.1, 0.12);
const MUTED = rgb(0.4, 0.4, 0.45);

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

  private wrap(text: string, font: PDFFont, size: number): string[] {
    const max = PAGE.w - PAGE.margin * 2;
    const lines: string[] = [];
    for (const paragraph of pdfSafe(text).split("\n")) {
      let line = "";
      for (const word of paragraph.split(/ +/)) {
        // break words that are wider than a whole line (long URLs etc.)
        const pieces: string[] = [];
        let rest = word;
        while (rest && font.widthOfTextAtSize(rest, size) > max) {
          let n = rest.length;
          while (n > 1 && font.widthOfTextAtSize(rest.slice(0, n), size) > max) n--;
          pieces.push(rest.slice(0, n));
          rest = rest.slice(n);
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

  text(text: string, opts: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb>; gap?: number } = {}) {
    const size = opts.size ?? 10;
    const font = opts.bold ? this.bold : this.regular;
    const lead = size * 1.35;
    for (const line of this.wrap(text, font, size)) {
      if (this.y - lead < PAGE.margin) this.newPage();
      this.y -= lead;
      if (line) this.page.drawText(line, { x: PAGE.margin, y: this.y, size, font, color: opts.color ?? INK });
    }
    this.y -= opts.gap ?? 0;
  }

  heading(title: string) {
    if (this.y - 60 < PAGE.margin) this.newPage();
    this.y -= 8;
    this.text(title.toUpperCase(), { size: 11, bold: true, gap: 2 });
    this.page.drawLine({
      start: { x: PAGE.margin, y: this.y + 2 },
      end: { x: PAGE.w - PAGE.margin, y: this.y + 2 },
      thickness: 0.6,
      color: MUTED,
    });
    this.y -= 4;
  }
}

export async function buildCvPdf(c: Content): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const w = new Writer(doc, await doc.embedFont(StandardFonts.Helvetica), await doc.embedFont(StandardFonts.HelveticaBold));

  w.text(c.profile.name, { size: 22, bold: true });
  if (c.profile.title) w.text(c.profile.title, { size: 12, color: MUTED });
  const contact = [c.profile.email, ...c.socials.map((s) => s.link)].join("  |  ");
  w.text(contact, { size: 9, color: MUTED, gap: 4 });

  if (c.profile.intro) {
    w.heading("Summary");
    w.text(c.profile.intro, { gap: 4 });
  }

  if (c.experience.length) {
    w.heading("Experience");
    for (const e of c.experience) {
      w.text(`${e.title} - ${e.company}`, { size: 11, bold: true });
      w.text([e.year, ...e.labels].filter(Boolean).join("  |  "), { size: 9, color: MUTED });
      w.text(e.description, { gap: 6 });
    }
  }

  if (c.stack.length) {
    w.heading("Technical Stack");
    w.text(c.stack.map((s) => s.title).join(", "), { gap: 4 });
  }

  if (c.projects.length) {
    w.heading("Projects");
    for (const p of c.projects) {
      w.text(p.title, { size: 11, bold: true });
      w.text([p.link, p.type, `${p.pages} pages`].filter(Boolean).join("  |  "), { size: 9, color: MUTED });
      w.text(p.description, { gap: 6 });
    }
  }

  if (c.services.length) {
    w.heading("Services");
    for (const s of c.services) {
      w.text(s.title, { bold: true });
      w.text(s.description, { gap: 4 });
    }
  }

  return doc.save();
}
