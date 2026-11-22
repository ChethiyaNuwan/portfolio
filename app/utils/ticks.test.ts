import { describe, expect, test } from "bun:test";
import { createTickAccumulator } from "./ticks";

describe("createTickAccumulator (crown-style detents)", () => {
  const make = () => createTickAccumulator({ threshold: 90, quietMs: 150, maxPerPush: 6 });

  test("small movements add up and produce one tick when they cross the threshold", () => {
    const a = make();
    expect(a.push(40, 0)).toBe(0);
    expect(a.push(40, 16)).toBe(0);
    expect(a.push(40, 32)).toBe(1); // 120 total
  });

  test("a long continuous gesture produces many ticks and keeps the remainder", () => {
    const a = make();
    let ticks = 0;
    for (let i = 0; i < 10; i++) ticks += a.push(45, i * 16); // 450px
    expect(ticks).toBe(5);
  });

  test("direction is signed, and reversing drops the leftover from the other direction", () => {
    const a = make();
    expect(a.push(-100, 0)).toBe(-1);
    expect(a.push(60, 10)).toBe(0); // 10px left over was negative; reversing starts fresh
    expect(a.push(40, 20)).toBe(1);
  });

  test("a pause longer than the quiet time starts a new gesture", () => {
    const a = make();
    expect(a.push(80, 0)).toBe(0);
    expect(a.push(80, 400)).toBe(0); // the first 80 was forgotten
    expect(a.push(20, 416)).toBe(1);
  });

  test("one huge event cannot jump the whole page: ticks per push are capped", () => {
    expect(make().push(5000, 0)).toBe(6);
    expect(make().push(-5000, 0)).toBe(-6);
  });

  test("zero or invalid deltas do nothing", () => {
    const a = make();
    expect(a.push(0, 0)).toBe(0);
    expect(a.push(Number.NaN, 5)).toBe(0);
  });

  test("reset forgets the gesture", () => {
    const a = make();
    a.push(80, 0);
    a.reset();
    expect(a.push(20, 5)).toBe(0);
  });
});
