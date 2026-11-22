import { describe, expect, test } from "bun:test";
import { tickHaptic } from "./haptics";

describe("tickHaptic", () => {
  test("uses the Vibration API when the device has it: short pulse for a tick, a pattern for the end stop", () => {
    const calls: unknown[] = [];
    const nav = { vibrate: (p: unknown) => (calls.push(p), true) } as unknown as Navigator;
    expect(tickHaptic("tick", nav)).toBe("vibrate");
    expect(tickHaptic("bump", nav)).toBe("vibrate");
    expect(calls[0]).toBe(8);
    expect(Array.isArray(calls[1])).toBe(true);
  });

  test("does nothing, and never throws, where there is no haptic support (e.g. a Mac)", () => {
    expect(tickHaptic("tick", {} as Navigator)).toBe("none");
    expect(tickHaptic("tick", undefined)).toBe("none");
  });

  test("a vibrate call that throws is swallowed", () => {
    const nav = { vibrate: () => { throw new Error("blocked"); } } as unknown as Navigator;
    expect(tickHaptic("tick", nav)).toBe("none");
  });
});
