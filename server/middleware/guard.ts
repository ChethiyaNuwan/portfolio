const SAFE = new Set(["GET", "HEAD", "OPTIONS"]);

// Every /api/admin/** route needs a session; state-changing ones also need a matching CSRF token.
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;
  if (!path.startsWith("/api/admin")) return;
  if (SAFE.has(event.method)) await requireAdmin(event);
  else await requireCsrf(event);
});
