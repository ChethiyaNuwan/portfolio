import { describe, expect, test } from "bun:test";
import { csrfMatches, loadAdminConfig, newCsrfToken, verifyCredentials } from "./auth";

const good = { ADMIN_USERNAME: "owner", ADMIN_PASSWORD: "correct-horse-battery" };

describe("loadAdminConfig", () => {
  test("throws naming ADMIN_USERNAME when missing", async () => {
    await expect(loadAdminConfig({ ADMIN_PASSWORD: good.ADMIN_PASSWORD })).rejects.toThrow(/ADMIN_USERNAME/);
  });
  test("throws naming ADMIN_PASSWORD when missing", async () => {
    await expect(loadAdminConfig({ ADMIN_USERNAME: "owner" })).rejects.toThrow(/ADMIN_PASSWORD/);
  });
  test("throws when password shorter than 12 chars", async () => {
    await expect(loadAdminConfig({ ...good, ADMIN_PASSWORD: "short" })).rejects.toThrow(/at least 12/);
  });
});

describe("verifyCredentials", () => {
  test("accepts correct credentials only", async () => {
    const cfg = await loadAdminConfig(good);
    expect(await verifyCredentials(cfg, "owner", good.ADMIN_PASSWORD)).toBe(true);
    expect(await verifyCredentials(cfg, "other", good.ADMIN_PASSWORD)).toBe(false);
    expect(await verifyCredentials(cfg, "owner", "wrong-password-123")).toBe(false);
    expect(await verifyCredentials(cfg, "", "")).toBe(false);
  });
});

describe("csrf", () => {
  test("tokens are 64 hex chars and unique", () => {
    expect(newCsrfToken()).toMatch(/^[0-9a-f]{64}$/);
    expect(newCsrfToken()).not.toBe(newCsrfToken());
  });
  test("csrfMatches is strict", () => {
    const t = newCsrfToken();
    expect(csrfMatches(t, t)).toBe(true);
    expect(csrfMatches(t, newCsrfToken())).toBe(false);
    expect(csrfMatches(undefined, t)).toBe(false);
    expect(csrfMatches(t, undefined)).toBe(false);
    expect(csrfMatches(t, t.slice(1))).toBe(false);
  });
});
