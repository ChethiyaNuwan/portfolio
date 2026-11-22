import { describe, expect, test } from "bun:test";
import { KEYMAP, matchesAny, matchesChord, sectionDigit } from "./keybindings";

const ev = (o: Partial<KeyboardEvent>) => ({ key: "", code: "", ctrlKey: false, metaKey: false, altKey: false, shiftKey: false, ...o });

describe("matchesChord", () => {
  test("plain keys ignore case but reject extra modifiers", () => {
    expect(matchesChord(ev({ key: "l" }), { key: "l" }, false)).toBe(true);
    expect(matchesChord(ev({ key: "L", shiftKey: true }), { key: "l" }, false)).toBe(false);
    expect(matchesChord(ev({ key: "l", altKey: true }), { key: "l" }, false)).toBe(false);
    expect(matchesChord(ev({ key: "l", ctrlKey: true }), { key: "l" }, false)).toBe(false);
  });
  test("mod means Cmd on Mac and Ctrl elsewhere, and never the other one", () => {
    const k = { key: "k", mod: true };
    expect(matchesChord(ev({ key: "k", metaKey: true }), k, true)).toBe(true);
    expect(matchesChord(ev({ key: "k", ctrlKey: true }), k, true)).toBe(false);
    expect(matchesChord(ev({ key: "k", ctrlKey: true }), k, false)).toBe(true);
    expect(matchesChord(ev({ key: "k", metaKey: true }), k, false)).toBe(false);
  });
  test("physical code chords work regardless of the produced character", () => {
    expect(matchesChord(ev({ key: "]", code: "BracketRight" }), { code: "BracketRight" }, false)).toBe(true);
    expect(matchesChord(ev({ key: "}", code: "BracketRight", shiftKey: true }), { code: "BracketRight" }, false)).toBe(false);
  });
});

describe("KEYMAP", () => {
  test("next / prev accept arrows, vim keys and brackets", () => {
    for (const e of [ev({ key: "ArrowRight" }), ev({ key: "l" }), ev({ key: "]", code: "BracketRight" })]) expect(matchesAny(e, KEYMAP.next, false)).toBe(true);
    for (const e of [ev({ key: "ArrowLeft" }), ev({ key: "h" }), ev({ key: "[", code: "BracketLeft" })]) expect(matchesAny(e, KEYMAP.prev, false)).toBe(true);
  });
  test("palette is Mod+K or slash, and plain k is only scroll-up", () => {
    expect(matchesAny(ev({ key: "k", ctrlKey: true }), KEYMAP.palette, false)).toBe(true);
    expect(matchesAny(ev({ key: "k", metaKey: true }), KEYMAP.palette, true)).toBe(true);
    expect(matchesAny(ev({ key: "/" }), KEYMAP.palette, false)).toBe(true);
    expect(matchesAny(ev({ key: "k" }), KEYMAP.palette, false)).toBe(false);
    expect(matchesAny(ev({ key: "k" }), KEYMAP.scrollUp, false)).toBe(true);
    expect(matchesAny(ev({ key: "j" }), KEYMAP.scrollDown, false)).toBe(true);
  });
});

describe("sectionDigit", () => {
  test("Alt + digit jumps to that section (0-based index), by physical key", () => {
    expect(sectionDigit(ev({ code: "Digit1", altKey: true, key: "¡" }))).toBe(0);
    expect(sectionDigit(ev({ code: "Digit7", altKey: true }))).toBe(6);
  });
  test("ignores digits without Alt, or with other modifiers", () => {
    expect(sectionDigit(ev({ code: "Digit1" }))).toBeNull();
    expect(sectionDigit(ev({ code: "Digit1", altKey: true, ctrlKey: true }))).toBeNull();
    expect(sectionDigit(ev({ code: "Digit1", altKey: true, shiftKey: true }))).toBeNull();
    expect(sectionDigit(ev({ code: "Digit0", altKey: true }))).toBeNull();
  });
});
