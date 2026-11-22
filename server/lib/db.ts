import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { sectionKeys, sectionSchemas, type Content, type SectionKey } from "./schemas";
import { seedContent } from "./seed";

export interface Store {
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

  const insertSeed = db.prepare("INSERT OR IGNORE INTO sections (key, value, updated_at) VALUES (?, ?, ?)");
  for (const key of sectionKeys) insertSeed.run(key, JSON.stringify(seedContent[key]), Date.now());

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
