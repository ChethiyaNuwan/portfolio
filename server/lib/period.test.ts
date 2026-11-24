import { describe, expect, test } from "bun:test";
import { formatPeriod, parsePeriodText } from "./period";

const base = { startYear: 2023, startMonth: 1, endYear: 2023, endMonth: 6, present: false, showMonth: true };

describe("formatPeriod", () => {
  test("with months", () => expect(formatPeriod(base)).toBe("Jan 2023 - Jun 2023"));
  test("months hidden", () => expect(formatPeriod({ ...base, showMonth: false, endYear: 2025 })).toBe("2023 - 2025"));
  test("present", () => expect(formatPeriod({ ...base, present: true })).toBe("Jan 2023 - Present"));
  test("present without months", () => expect(formatPeriod({ ...base, present: true, showMonth: false })).toBe("2023 - Present"));
  test("a single year collapses", () => expect(formatPeriod({ ...base, showMonth: false })).toBe("2023"));
  test("a missing month on one side shows just the year there", () => expect(formatPeriod({ ...base, endMonth: 0, endYear: 2024 })).toBe("Jan 2023 - 2024"));
});

describe("parsePeriodText", () => {
  test("round trips every shape", () => {
    for (const t of ["Jan 2023 - Jun 2023", "2022 - Present", "2019 - 2021", "Mar 2020 - Present", "2018"]) {
      expect(formatPeriod(parsePeriodText(t))).toBe(t);
    }
  });
  test("reads months and present", () => {
    expect(parsePeriodText("Mar 2020 - Present")).toEqual({ startYear: 2020, startMonth: 3, endYear: 2020, endMonth: 0, present: true, showMonth: true });
    expect(parsePeriodText("2022 - Present").showMonth).toBe(false);
  });
  test("garbage falls back to the current year", () => {
    const p = parsePeriodText("long ago", new Date("2026-05-01"));
    expect(p.startYear).toBe(2026);
  });
});
