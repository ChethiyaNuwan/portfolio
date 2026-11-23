import type { H3Event } from "h3";
import { relyingParty } from "../lib/webauthn";

export function eventRelyingParty(event: H3Event) {
  const trust = process.env.TRUST_PROXY === "true";
  return relyingParty({
    siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
    host: (trust ? getHeader(event, "x-forwarded-host") : undefined) ?? getHeader(event, "host"),
    proto: (trust ? getHeader(event, "x-forwarded-proto") : undefined) ?? (getRequestURL(event).protocol.replace(":", "")),
  });
}
