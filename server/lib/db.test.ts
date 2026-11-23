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

describe("opening a database written by the previous version", () => {
  test("adds defaults to stored sections and seeds sections that did not exist", async () => {
    store = openStore(dir);
    store.close();
    store = undefined;

    const { Database } = await import("bun:sqlite");
    const raw = new Database(join(dir, "portfolio.db"));
    const oldProjects = seedContent.projects.map(({ tags: _t, gallery: _g, ...rest }) => rest);
    raw.run("UPDATE sections SET value = ? WHERE key = 'projects'", [JSON.stringify(oldProjects)]);
    raw.run("DELETE FROM sections WHERE key IN ('gallery', 'education')");
    raw.close();

    store = openStore(dir);
    expect(store.getSection("projects")[0]!.tags).toEqual([]);
    expect(store.getSection("projects")[0]!.gallery).toEqual([]);
    expect(store.getSection("gallery")).toEqual(seedContent.gallery);
    expect(store.getSection("education")).toEqual(seedContent.education);
  });
});

describe("passkeys", () => {
  test("add, read, touch and delete", () => {
    store = openStore(dir);
    expect(store.listPasskeys()).toEqual([]);
    store.addPasskey({ id: "abc", name: "Laptop", publicKey: "pk", counter: 0, transports: ["internal"] });
    const p = store.getPasskey("abc")!;
    expect(p.name).toBe("Laptop");
    expect(p.transports).toEqual(["internal"]);
    expect(p.lastUsedAt).toBeNull();
    store.touchPasskey("abc", 5);
    expect(store.getPasskey("abc")!.counter).toBe(5);
    expect(store.getPasskey("abc")!.lastUsedAt).not.toBeNull();
    expect(store.deletePasskey("abc")).toBe(true);
    expect(store.deletePasskey("abc")).toBe(false);
    expect(store.getPasskey("abc")).toBeUndefined();
  });
  test("survive reopening the database", () => {
    store = openStore(dir);
    store.addPasskey({ id: "k1", name: "Phone", publicKey: "pk", counter: 1, transports: [] });
    store.close();
    store = openStore(dir);
    expect(store.listPasskeys().map((p) => p.id)).toEqual(["k1"]);
  });
});
