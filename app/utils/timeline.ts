// Turns free-text periods ("2022 - Present", "Jan 2023 - Jun 2023") into a git-graph style layout where a
// branch's length is proportional to how long the job lasted. Pure functions, no framework code.

export interface Period {
  /** month index = year * 12 + month (0-based) */
  start: number;
  end: number;
  present: boolean;
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const PRESENT = /present|now|current|ongoing|today/i;
const DATE = /(?:([A-Za-z]{3,9})\.?\s+)?(\d{4})/;

const monthIndex = (year: number, month: number) => year * 12 + month;

function readDate(text: string): { year: number; month: number | null } | null {
  const match = DATE.exec(text);
  if (!match) return null;
  const month = match[1] ? MONTHS.indexOf(match[1].slice(0, 3).toLowerCase()) : -1;
  return { year: Number(match[2]), month: month >= 0 ? month : null };
}

export function parsePeriod(text: string, now: Date): Period | null {
  const parts = text.split(/\s*(?:[-–—]|\bto\b)\s*/i).filter(Boolean);
  const first = parts[0] ? readDate(parts[0]) : null;
  if (!first) return null;

  const start = monthIndex(first.year, first.month ?? 0);
  if (parts.length === 1) return { start, end: monthIndex(first.year, first.month ?? 11), present: false };

  const last = parts[parts.length - 1]!;
  if (PRESENT.test(last)) return { start, end: monthIndex(now.getFullYear(), now.getMonth()), present: true };
  const end = readDate(last);
  if (!end) return { start, end: start, present: false };
  return { start, end: monthIndex(end.year, end.month ?? 11), present: false };
}

export function durationLabel(p: Period): string {
  const months = Math.max(1, p.end - p.start + 1);
  if (months < 12) return `${months} ${months === 1 ? "mo" : "mos"}`;
  const y = Math.floor(months / 12);
  const r = months % 12;
  const years = `${y} ${y === 1 ? "yr" : "yrs"}`;
  return r ? `${years} ${r} ${r === 1 ? "mo" : "mos"}` : years;
}

export interface LayoutOptions {
  pxPerMonth: number;
  cardHeight: number;
  cardGap: number;
  minBranch: number;
  padTop: number;
  padBottom: number;
}

export interface TreeItem {
  id: string;
  period: Period;
  side: "left" | "right";
  /** colour lane, 0..2 */
  lane: number;
  yTop: number;
  yBottom: number;
  cardTop: number;
  present: boolean;
}

export interface TreeLayout {
  height: number;
  items: TreeItem[];
  years: { label: string; y: number }[];
}

export function layoutTree(entries: { id: string; period: Period | null }[], now: Date, o: LayoutOptions): TreeLayout {
  // Entries whose period cannot be read are placed below the dated ones so nothing is lost.
  const dated = entries.filter((e) => e.period) as { id: string; period: Period }[];
  const nowMonth = monthIndex(now.getFullYear(), now.getMonth());
  let floor = dated.length ? Math.min(...dated.map((e) => e.period.start)) : nowMonth;
  const resolved = entries.map((e) => {
    if (e.period) return { id: e.id, period: e.period };
    const end = floor - 1;
    floor = end - 3;
    return { id: e.id, period: { start: end - 2, end, present: false } };
  });

  resolved.sort((a, b) => b.period.end - a.period.end || b.period.start - a.period.start);

  if (!resolved.length) return { height: o.padTop + o.padBottom, items: [], years: [] };

  const topMonth = Math.max(...resolved.map((e) => e.period.end));
  const bottomMonth = Math.min(...resolved.map((e) => e.period.start));

  const items: TreeItem[] = resolved.map((e, i) => {
    const yTop = o.padTop + (topMonth - e.period.end) * o.pxPerMonth;
    let yBottom = o.padTop + (topMonth - e.period.start + 1) * o.pxPerMonth;
    if (yBottom - yTop < o.minBranch) yBottom = yTop + o.minBranch;
    const desired = Math.max(o.padTop, (yTop + yBottom) / 2 - o.cardHeight / 2);
    return { id: e.id, period: e.period, side: i % 2 === 0 ? "right" : "left", lane: i % 3, yTop, yBottom, cardTop: desired, present: e.period.present };
  });

  // Cards on the same side are pushed down until they no longer overlap.
  for (const side of ["left", "right"] as const) {
    let lastBottom = -Infinity;
    for (const it of items.filter((x) => x.side === side).sort((a, b) => a.cardTop - b.cardTop)) {
      it.cardTop = Math.max(it.cardTop, lastBottom + o.cardGap);
      lastBottom = it.cardTop + o.cardHeight;
    }
  }

  const height = Math.max(...items.map((i) => i.yBottom), ...items.map((i) => i.cardTop + o.cardHeight)) + o.padBottom;

  const years: TreeLayout["years"] = [];
  for (let y = Math.ceil(bottomMonth / 12); y * 12 <= topMonth; y++) {
    years.push({ label: String(y), y: o.padTop + (topMonth - y * 12 + 1) * o.pxPerMonth });
  }

  return { height, items, years };
}
