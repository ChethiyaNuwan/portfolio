import { createHash } from "node:crypto";

export interface RelyingParty {
  rpID: string;
  origin: string;
}

/**
 * Where passkeys are scoped to. The canonical site URL wins (NUXT_PUBLIC_SITE_URL, needed behind a proxy);
 * otherwise the origin the admin page was loaded from. A passkey only works on the host it was created for.
 */
export function relyingParty(input: { siteUrl?: string; host?: string; proto?: string }): RelyingParty {
  const site = input.siteUrl?.trim();
  if (site) {
    const u = new URL(site);
    return { rpID: u.hostname, origin: u.origin };
  }
  const host = (input.host ?? "localhost").split(",")[0]!.trim();
  const proto = input.proto === "https" ? "https" : "http";
  return { rpID: host.replace(/:\d+$/, ""), origin: `${proto}://${host}` };
}

/** A stable, opaque WebAuthn user handle for the single admin account. */
export const userHandle = (username: string): Uint8Array<ArrayBuffer> => new Uint8Array(createHash("sha256").update(`portfolio-admin:${username}`).digest());

export const toBase64Url = (bytes: Uint8Array): string => Buffer.from(bytes).toString("base64url");
export const fromBase64Url = (s: string): Uint8Array<ArrayBuffer> => new Uint8Array(Buffer.from(s, "base64url"));
