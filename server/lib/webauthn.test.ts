import { describe, expect, test } from "bun:test";
import { fromBase64Url, relyingParty, toBase64Url, userHandle } from "./webauthn";

describe("relyingParty", () => {
  test("the configured site URL wins", () => {
    expect(relyingParty({ siteUrl: "https://me.dev/", host: "10.0.0.5:3000", proto: "http" })).toEqual({ rpID: "me.dev", origin: "https://me.dev" });
  });
  test("falls back to the request host, keeping the port in the origin only", () => {
    expect(relyingParty({ host: "localhost:3222", proto: "http" })).toEqual({ rpID: "localhost", origin: "http://localhost:3222" });
  });
  test("uses https only when the request says so", () => {
    expect(relyingParty({ host: "me.dev", proto: "https" }).origin).toBe("https://me.dev");
    expect(relyingParty({ host: "me.dev", proto: "gopher" }).origin).toBe("http://me.dev");
  });
});

describe("helpers", () => {
  test("user handle is stable, opaque and 32 bytes", () => {
    expect(userHandle("admin")).toEqual(userHandle("admin"));
    expect(userHandle("admin")).not.toEqual(userHandle("other"));
    expect(userHandle("admin").length).toBe(32);
  });
  test("base64url round trip", () => {
    const bytes = new Uint8Array([0, 250, 255, 3, 99]);
    expect(fromBase64Url(toBase64Url(bytes))).toEqual(bytes);
  });
});
