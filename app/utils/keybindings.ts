// Keyboard shortcuts for moving around the page, in the style of code editors: arrows and vim keys,
// bracket keys for previous/next, Alt + number to jump to a section, and Cmd/Ctrl + K for a command palette.
export interface Chord {
  key?: string;
  /** physical key (layout independent), e.g. "BracketRight" */
  code?: string;
  /** Cmd on macOS, Ctrl elsewhere */
  mod?: boolean;
  alt?: boolean;
  shift?: boolean;
}

type KeyEventLike = Pick<KeyboardEvent, "key" | "code" | "ctrlKey" | "metaKey" | "altKey" | "shiftKey">;

export const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.platform);

export function matchesChord(e: KeyEventLike, c: Chord, mac = isMac()): boolean {
  const mod = mac ? e.metaKey : e.ctrlKey;
  const otherMod = mac ? e.ctrlKey : e.metaKey;
  if (!!c.mod !== mod || otherMod) return false;
  if (!!c.alt !== e.altKey || !!c.shift !== e.shiftKey) return false;
  if (c.code) return e.code === c.code;
  return !!c.key && e.key.toLowerCase() === c.key.toLowerCase();
}

export const matchesAny = (e: KeyEventLike, chords: Chord[], mac = isMac()) => chords.some((c) => matchesChord(e, c, mac));

export const KEYMAP = {
  next: [{ key: "ArrowRight" }, { key: "l" }, { code: "BracketRight" }] as Chord[],
  prev: [{ key: "ArrowLeft" }, { key: "h" }, { code: "BracketLeft" }] as Chord[],
  scrollDown: [{ key: "j" }] as Chord[],
  scrollUp: [{ key: "k" }] as Chord[],
  palette: [{ key: "k", mod: true }, { key: "/" }] as Chord[],
};

/** Alt + 1..9 => 0-based section index, otherwise null. */
export function sectionDigit(e: KeyEventLike): number | null {
  if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return null;
  const m = /^Digit([1-9])$/.exec(e.code);
  return m ? Number(m[1]) - 1 : null;
}
