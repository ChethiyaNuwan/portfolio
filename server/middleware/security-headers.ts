// PostHog (analytics + session replay) loads its recorder from the assets host and posts events to the API host
function posthogHosts(): string {
  const host = String(useRuntimeConfig().public.posthogHost || "https://us.i.posthog.com");
  try {
    const u = new URL(host);
    const hosts = [u.origin];
    if (u.hostname.endsWith(".i.posthog.com")) hosts.push(`https://${u.hostname.replace(".i.", "-assets.i.")}`);
    return hosts.join(" ");
  } catch {
    return "";
  }
}

const csp = () => [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com ${posthogHosts()}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com",
  `connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com ${posthogHosts()}`,
  "worker-src 'self' blob:",
  "font-src 'self' data:",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname;
  setHeaders(event, {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "same-origin",
  });
  // The dev server needs inline eval/websockets, so only enforce CSP in production.
  if (!import.meta.dev) setHeader(event, "Content-Security-Policy", csp());
  if (path.startsWith("/admin") || path.startsWith("/api/")) setHeader(event, "X-Robots-Tag", "noindex, nofollow");
});
