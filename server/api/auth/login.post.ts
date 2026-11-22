import { newCsrfToken, verifyCredentials } from "../../lib/auth";

export default defineEventHandler(async (event) => {
  const trustProxy = process.env.TRUST_PROXY === "true";
  const key = getRequestIP(event, { xForwardedFor: trustProxy }) ?? "unknown";

  const gate = loginLimiter.check(key);
  if (!gate.allowed) {
    setHeader(event, "Retry-After", Math.ceil(gate.retryAfterMs / 1000));
    throw createError({ statusCode: 429, statusMessage: "Too many attempts. Try again later." });
  }

  const body = (await readBody(event).catch(() => ({}))) as Record<string, unknown> | null;
  const username = typeof body?.username === "string" ? body.username.slice(0, 200) : "";
  const password = typeof body?.password === "string" ? body.password.slice(0, 500) : "";

  if (!(await verifyCredentials(useAdminConfig(), username, password))) {
    loginLimiter.fail(key);
    setResponseStatus(event, 401);
    return { message: "Invalid credentials" };
  }

  loginLimiter.reset(key);
  const session = await getAdminSession(event);
  await session.clear(); // fresh session on every login
  const csrfToken = newCsrfToken();
  await session.update({ authenticated: true, csrf: csrfToken });
  return { csrfToken };
});
