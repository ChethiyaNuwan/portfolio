// Experience periods. The admin edits structured dates (year, optional month, "present"); the readable text
// ("Jan 2023 - Jun 2023", "2022 - Present") is derived from them, so the CV, the AI files and the git tree can keep
// reading the text while the admin stays a plain form.

export interface PeriodFields {
  startYear: number;
  /** 0 = no month */
  startMonth: number;
  endYear: number;
  endMonth: number;
  present: boolean;
  /** false hides the months everywhere (and the git tree treats both ends as whole years) */
  showMonth: boolean;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const monthName = (m: number): string => MONTHS[m - 1] ?? "";

const side = (year: number, month: number, showMonth: boolean) => (showMonth && month >= 1 && month <= 12 ? `${monthName(month)} ${year}` : String(year));

export function formatPeriod(p: PeriodFields): string {
  const start = side(p.startYear, p.startMonth, p.showMonth);
  if (p.present) return `${start} - Present`;
  const end = side(p.endYear, p.endMonth, p.showMonth);
  return end === start ? start : `${start} - ${end}`;
}

const MONTH_RE = /^\s*(?:([a-z]{3,9})\.?\s+)?(\d{4})\s*$/i;
const PRESENT_RE = /^(present|now|current|ongoing)$/i;

function readSide(text: string): { year: number; month: number } | null {
  const m = MONTH_RE.exec(text);
  if (!m) return null;
  const idx = m[1] ? MONTHS.findIndex((n) => n.toLowerCase() === m[1]!.slice(0, 3).toLowerCase()) : -1;
  return { year: Number(m[2]), month: idx >= 0 ? idx + 1 : 0 };
}

/** Reads the text of an older entry ("Jan 2023 - Jun 2023") into structured fields. */
export function parsePeriodText(text: string, now = new Date()): PeriodFields {
  const parts = text.split(/\s*(?:[-–—]|\bto\b)\s*/i).filter(Boolean);
  const first = parts[0] ? readSide(parts[0]) : null;
  const thisYear = now.getFullYear();
  if (!first) return { startYear: thisYear, startMonth: 0, endYear: thisYear, endMonth: 0, present: false, showMonth: false };
  const last = parts.length > 1 ? parts[parts.length - 1]! : "";
  const present = PRESENT_RE.test(last);
  const end = parts.length > 1 && !present ? readSide(last) : null;
  return {
    startYear: first.year,
    startMonth: first.month,
    endYear: end?.year ?? first.year,
    endMonth: end?.month ?? (parts.length > 1 ? 0 : first.month),
    present,
    showMonth: first.month > 0 || (end?.month ?? 0) > 0,
  };
}
