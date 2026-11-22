import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openStore, type Store } from "./db";
import { seedContent } from "./seed";

let dir: string;
let store: Store | undefined;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "store-"));
});
afterEach(() => {
  store?.close();
  store = undefined;
  rmSync(dir, { recursive: true, force: true });
});

describe("content store", () => {
  test("fresh store returns seed content and creates uploads dir", () => {
    store = openStore(dir);
    expect(store.getContent()).toEqual(seedContent);
    expect(existsSync(join(dir, "uploads"))).toBe(true);
  });

  test("saved sections persist across re-open without re-seeding", () => {
    store = openStore(dir);
    const faq = [{ id: "x", question: "Q?", answer: "A." }];
    store.saveSection("faq", faq);
    store.close();
    store = openStore(dir);
    expect(store.getSection("faq")).toEqual(faq);
  });

  test("invalid payload throws and leaves value and version unchanged", () => {
    store = openStore(dir);
    const before = store.version();
    expect(() => store!.saveSection("projects", [{ id: "1", pages: "x" }])).toThrow();
    expect(store.getSection("projects")).toEqual(seedContent.projects);
    expect(store.version()).toBe(before);
  });

  test("version increments by one per successful save", () => {
    store = openStore(dir);
    const v = store.version();
    store.saveSection("faq", []);
    store.saveSection("faq", []);
    expect(store.version()).toBe(v + 2);
  });
});
