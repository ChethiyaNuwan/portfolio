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
  help: [] as Chord[],
};

/** Alt + 1..9 => 0-based section index, otherwise null. */
export function sectionDigit(e: KeyEventLike): number | null {
  if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return null;
  const m = /^Digit([1-9])$/.exec(e.code);
  return m ? Number(m[1]) - 1 : null;
}

// "?" by character (any layout) or as Shift + the physical slash key
KEYMAP.help.push({ key: "?", shift: true }, { code: "Slash", shift: true });

/** Key names as the key caps (UKbd) expect: "meta", "alt", "shift", "arrowright", single characters in capitals. */
export function chordKeys(c: Chord): string[] {
  const keys: string[] = [];
  if (c.mod) keys.push("meta");
  if (c.alt) keys.push("alt");
  if (c.shift && c.key !== "?" && c.code !== "Slash") keys.push("shift");
  if (c.code === "Slash") keys.push("?");
  else if (c.code === "BracketRight") keys.push("]");
  else if (c.code === "BracketLeft") keys.push("[");
  else if (c.key) keys.push(c.key.length === 1 ? c.key.toUpperCase() : c.key.toLowerCase());
  return keys;
}

/** Chords that display identically are listed once. */
const uniqueChords = (chords: Chord[]) => {
  const seen = new Set<string>();
  return chords.map(chordKeys).filter((k) => !seen.has(k.join("+")) && !!seen.add(k.join("+")));
};

export interface BindingDoc {
  group: string;
  action: string;
  /** alternative chords, each a list of key names */
  keys: string[][];
}

// What the shortcuts do, shown in the footer ticker and the shortcuts dialog. Built from KEYMAP so it cannot drift.
export const BINDING_DOCS: BindingDoc[] = [
  { group: "Move between sections", action: "Next section", keys: KEYMAP.next.map(chordKeys) },
  { group: "Move between sections", action: "Previous section", keys: KEYMAP.prev.map(chordKeys) },
  { group: "Move between sections", action: "Jump to section 1 to 7", keys: [["alt", "1–7"]] },
  { group: "Move between sections", action: "Sideways with the mouse wheel", keys: [["shift", "Scroll"]] },
  { group: "Scroll inside a section", action: "Scroll down", keys: [...KEYMAP.scrollDown.map(chordKeys), ["arrowdown"], ["pagedown"]] },
  { group: "Scroll inside a section", action: "Scroll up", keys: [...KEYMAP.scrollUp.map(chordKeys), ["arrowup"], ["pageup"]] },
  { group: "Search and help", action: "Open the command palette", keys: KEYMAP.palette.map(chordKeys) },
  { group: "Search and help", action: "Show all key bindings", keys: uniqueChords(KEYMAP.help) },
  { group: "Search and help", action: "Close a dialog", keys: [["escape"]] },
  { group: "Image viewer", action: "Previous or next image", keys: [["arrowleft"], ["arrowright"]] },
  { group: "Image viewer", action: "Close the image", keys: [["escape"]] },
];

/** One chord per entry, for the rotating footer ticker. */
export const TICKER = BINDING_DOCS.filter((d) => d.group !== "Image viewer").map((d) => ({ action: d.action, keys: d.keys[0]! }));
