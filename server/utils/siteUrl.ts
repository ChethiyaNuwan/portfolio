import type { H3Event } from "h3";
import { normalizeSiteUrl } from "../lib/seo";

export function siteUrlFor(event: H3Event): string {
  const trust = process.env.TRUST_PROXY === "true";
  const origin = getRequestURL(event, { xForwardedHost: trust, xForwardedProto: trust }).origin;
  return normalizeSiteUrl(useRuntimeConfig(event).public.siteUrl as string, origin);
}
