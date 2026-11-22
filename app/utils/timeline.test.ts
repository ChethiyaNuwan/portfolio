import { describe, expect, test } from "bun:test";
import { durationLabel, layoutTree, parsePeriod } from "./timeline";

const NOW = new Date(2026, 10, 15); // Nov 2026
const m = (y: number, mo: number) => y * 12 + mo; // month index, mo is 0-based

describe("parsePeriod", () => {
  test("year range to present", () => {
    expect(parsePeriod("2022 - Present", NOW)).toEqual({ start: m(2022, 0), end: m(2026, 10), present: true });
  });
  test("month-year range", () => {
    expect(parsePeriod("Jan 2023 - Jun 2023", NOW)).toEqual({ start: m(2023, 0), end: m(2023, 5), present: false });
  });
  test("full month names, en dash and different spacing", () => {
    expect(parsePeriod("March 2020 – December 2021", NOW)).toEqual({ start: m(2020, 2), end: m(2021, 11), present: false });
  });
  test("year only range covers whole years", () => {
    expect(parsePeriod("2019 - 2021", NOW)).toEqual({ start: m(2019, 0), end: m(2021, 11), present: false });
  });
  test("a single year is that whole year", () => {
    expect(parsePeriod("2018", NOW)).toEqual({ start: m(2018, 0), end: m(2018, 11), present: false });
  });
  test("returns null when there is no year", () => {
    expect(parsePeriod("Summer", NOW)).toBeNull();
    expect(parsePeriod("", NOW)).toBeNull();
  });
});

describe("durationLabel", () => {
  test("formats months and years", () => {
    expect(durationLabel({ start: m(2023, 0), end: m(2023, 5), present: false })).toBe("6 mos");
    expect(durationLabel({ start: m(2023, 0), end: m(2023, 0), present: false })).toBe("1 mo");
    expect(durationLabel({ start: m(2022, 0), end: m(2023, 2), present: false })).toBe("1 yr 3 mos");
    expect(durationLabel({ start: m(2022, 0), end: m(2023, 11), present: false })).toBe("2 yrs");
  });
});

describe("layoutTree", () => {
  const entries = [
    { id: "intern", period: parsePeriod("Jan 2023 - Jun 2023", NOW) },
    { id: "freelance", period: parsePeriod("2022 - Present", NOW) },
    { id: "invadraw", period: parsePeriod("2025 - Present", NOW) },
  ];
  const opts = { pxPerMonth: 20, cardHeight: 280, cardGap: 24, minBranch: 64, padTop: 40, padBottom: 40 };
  const L = layoutTree(entries, NOW, opts);
  const byId = Object.fromEntries(L.items.map((i) => [i.id, i]));

  test("newest first, alternating sides starting on the right", () => {
    expect(L.items[0]!.id).toBe("invadraw");
    expect(L.items.map((i) => i.side)).toEqual(["right", "left", "right"]);
  });

  test("branch length is proportional to duration (never shorter than the minimum)", () => {
    const len = (id: string) => byId[id]!.yBottom - byId[id]!.yTop;
    expect(len("freelance")).toBeGreaterThan(len("invadraw"));
    expect(len("invadraw")).toBeGreaterThan(len("intern"));
    expect(len("freelance")).toBe(59 * 20); // Jan 2022 .. Nov 2026
    expect(len("intern")).toBeGreaterThanOrEqual(64);
  });

  test("open-ended jobs reach the top (now) and are flagged", () => {
    expect(byId["invadraw"]!.present).toBe(true);
    expect(byId["invadraw"]!.yTop).toBe(40);
    expect(byId["intern"]!.present).toBe(false);
    expect(byId["intern"]!.yTop).toBeGreaterThan(40);
  });

  test("cards on the same side never overlap", () => {
    for (const side of ["left", "right"] as const) {
      const cards = L.items.filter((i) => i.side === side).sort((a, b) => a.cardTop - b.cardTop);
      for (let i = 1; i < cards.length; i++) expect(cards[i]!.cardTop - cards[i - 1]!.cardTop).toBeGreaterThanOrEqual(280 + 24);
    }
  });

  test("everything fits inside the reported height", () => {
    for (const i of L.items) {
      expect(i.cardTop + 280).toBeLessThanOrEqual(L.height);
      expect(i.yBottom).toBeLessThanOrEqual(L.height);
    }
  });

  test("close, same-side cards are pushed apart instead of overlapping", () => {
    const close = layoutTree(
      [
        { id: "a", period: parsePeriod("Jan 2024 - Dec 2024", NOW) },
        { id: "b", period: parsePeriod("Jan 2023 - Dec 2023", NOW) },
        { id: "c", period: parsePeriod("Jan 2022 - Dec 2022", NOW) },
      ],
      NOW,
      { ...opts, pxPerMonth: 4 },
    );
    const right = close.items.filter((i) => i.side === "right").sort((x, y) => x.cardTop - y.cardTop);
    expect(right[1]!.cardTop - right[0]!.cardTop).toBeGreaterThanOrEqual(304);
  });

  test("year markers sit on January boundaries inside the range", () => {
    const years = L.years.map((y) => y.label);
    expect(years).toContain("2023");
    expect(years).toContain("2026");
    expect(L.years.every((y) => y.y >= 40 && y.y <= L.height)).toBe(true);
  });

  test("entries without a parsable period are still placed", () => {
    const l = layoutTree([{ id: "x", period: null }, { id: "y", period: parsePeriod("2024 - 2025", NOW) }], NOW, opts);
    expect(l.items).toHaveLength(2);
    expect(l.items.every((i) => Number.isFinite(i.yTop) && Number.isFinite(i.cardTop))).toBe(true);
  });
});
