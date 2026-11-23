import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { sectionKeys, sectionSchemas, type Content, type SectionKey } from "./schemas";
import { seedContent } from "./seed";

export interface PasskeyRecord {
  /** credential id, base64url */
  id: string;
  name: string;
  /** COSE public key, base64url */
  publicKey: string;
  counter: number;
  transports: string[];
  createdAt: number;
  lastUsedAt: number | null;
}

export interface Store {
  listPasskeys(): PasskeyRecord[];
  getPasskey(id: string): PasskeyRecord | undefined;
  addPasskey(p: Omit<PasskeyRecord, "createdAt" | "lastUsedAt">): void;
  touchPasskey(id: string, counter: number): void;
  deletePasskey(id: string): boolean;
  dataDir: string;
  getContent(): Content;
  getSection<K extends SectionKey>(key: K): Content[K];
  /** Validates against the section schema; throws ZodError and changes nothing when invalid. */
  saveSection<K extends SectionKey>(key: K, value: unknown): Content[K];
  version(): number;
  close(): void;
}

export function openStore(dataDir: string): Store {
  mkdirSync(join(dataDir, "uploads"), { recursive: true });
  const db = new Database(join(dataDir, "portfolio.db"), { create: true });
  db.run("PRAGMA journal_mode = WAL");
  db.run("CREATE TABLE IF NOT EXISTS sections (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at INTEGER NOT NULL)");
  db.run("CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value INTEGER NOT NULL)");
  db.run("INSERT OR IGNORE INTO meta (key, value) VALUES ('version', 0)");
  db.run(
    "CREATE TABLE IF NOT EXISTS passkeys (id TEXT PRIMARY KEY, name TEXT NOT NULL, public_key TEXT NOT NULL, counter INTEGER NOT NULL, transports TEXT NOT NULL, created_at INTEGER NOT NULL, last_used_at INTEGER)",
  );
  const toPasskey = (r: { id: string; name: string; public_key: string; counter: number; transports: string; created_at: number; last_used_at: number | null }): PasskeyRecord => ({
    id: r.id,
    name: r.name,
    publicKey: r.public_key,
    counter: r.counter,
    transports: JSON.parse(r.transports) as string[],
    createdAt: r.created_at,
    lastUsedAt: r.last_used_at,
  });

  const insertSeed = db.prepare("INSERT OR IGNORE INTO sections (key, value, updated_at) VALUES (?, ?, ?)");
  for (const key of sectionKeys) insertSeed.run(key, JSON.stringify(seedContent[key]), Date.now());

  // Bring rows written by an older version up to date (adds defaults for new fields).
  const update = db.prepare("UPDATE sections SET value = ? WHERE key = ?");
  for (const key of sectionKeys) {
    const row = db.prepare("SELECT value FROM sections WHERE key = ?").get(key) as { value: string };
    const parsed = sectionSchemas[key].safeParse(JSON.parse(row.value));
    if (parsed.success && JSON.stringify(parsed.data) !== row.value) update.run(JSON.stringify(parsed.data), key);
  }

  const select = db.prepare("SELECT value FROM sections WHERE key = ?");
  const upsert = db.prepare(
    "INSERT INTO sections (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at",
  );
  const bump = db.prepare("UPDATE meta SET value = value + 1 WHERE key = 'version'");
  const selectVersion = db.prepare("SELECT value FROM meta WHERE key = 'version'");

  const getSection = <K extends SectionKey>(key: K): Content[K] => {
    const row = select.get(key) as { value: string };
    return JSON.parse(row.value) as Content[K];
  };

  const save = db.transaction((key: SectionKey, json: string) => {
    upsert.run(key, json, Date.now());
    bump.run();
  });

  return {
    dataDir,
    listPasskeys: () => (db.prepare("SELECT * FROM passkeys ORDER BY created_at").all() as Parameters<typeof toPasskey>[0][]).map(toPasskey),
    getPasskey: (id) => {
      const r = db.prepare("SELECT * FROM passkeys WHERE id = ?").get(id) as Parameters<typeof toPasskey>[0] | null;
      return r ? toPasskey(r) : undefined;
    },
    addPasskey: (p) => {
      db.prepare("INSERT INTO passkeys (id, name, public_key, counter, transports, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(p.id, p.name, p.publicKey, p.counter, JSON.stringify(p.transports), Date.now());
    },
    touchPasskey: (id, counter) => {
      db.prepare("UPDATE passkeys SET counter = ?, last_used_at = ? WHERE id = ?").run(counter, Date.now(), id);
    },
    deletePasskey: (id) => db.prepare("DELETE FROM passkeys WHERE id = ?").run(id).changes > 0,
    getSection,
    getContent: () => Object.fromEntries(sectionKeys.map((k) => [k, getSection(k)])) as Content,
    saveSection(key, value) {
      const parsed = sectionSchemas[key].parse(value);
      save(key, JSON.stringify(parsed));
      return parsed as never;
    },
    version: () => (selectVersion.get() as { value: number }).value,
    close: () => db.close(),
  };
}
