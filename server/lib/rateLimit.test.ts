import { describe, expect, test } from "bun:test";
import { createLimiter } from "./rateLimit";

describe("createLimiter", () => {
  test("locks after max failures and unlocks after lockMs", () => {
    let now = 1_000;
    const l = createLimiter({ max: 3, windowMs: 60_000, lockMs: 10_000, now: () => now });
    for (let i = 0; i < 3; i++) {
      expect(l.check("ip").allowed).toBe(true);
      l.fail("ip");
    }
    const locked = l.check("ip");
    expect(locked.allowed).toBe(false);
    expect(locked.retryAfterMs).toBeGreaterThan(0);
    expect(locked.retryAfterMs).toBeLessThanOrEqual(10_000);
    now += 10_001;
    expect(l.check("ip").allowed).toBe(true);
  });

  test("failures outside the window are forgotten", () => {
    let now = 0;
    const l = createLimiter({ max: 2, windowMs: 1_000, lockMs: 5_000, now: () => now });
    l.fail("ip");
    now += 2_000;
    l.fail("ip");
    expect(l.check("ip").allowed).toBe(true);
  });

  test("reset clears a key and keys are independent", () => {
    const l = createLimiter({ max: 1, windowMs: 60_000, lockMs: 60_000 });
    l.fail("a");
    expect(l.check("a").allowed).toBe(false);
    expect(l.check("b").allowed).toBe(true);
    l.reset("a");
    expect(l.check("a").allowed).toBe(true);
  });
});

describe("attempt (atomic check + count)", () => {
  test("a burst of concurrent attempts is capped at max before any verification finishes", () => {
    const l = createLimiter({ max: 5, windowMs: 60_000, lockMs: 60_000 });
    const results = Array.from({ length: 500 }, () => l.attempt("ip").allowed);
    expect(results.filter(Boolean)).toHaveLength(5);
  });

  test("reset after success clears the counted attempts", () => {
    const l = createLimiter({ max: 2, windowMs: 60_000, lockMs: 60_000 });
    l.attempt("ip");
    l.reset("ip");
    expect(l.attempt("ip").allowed).toBe(true);
    expect(l.attempt("ip").allowed).toBe(true);
  });
});
