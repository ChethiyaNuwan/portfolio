import { randomBytes } from "node:crypto";
import type { H3Event } from "h3";
import { csrfMatches } from "../lib/auth";

export interface AdminSessionData {
  authenticated?: boolean;
  csrf?: string;
  /** WebAuthn challenge for the ceremony in progress */
  challenge?: string;
}

const SESSION_HOURS = 8;
const envSecret = process.env.SESSION_SECRET;
if (!envSecret || envSecret.length < 32) {
  console.warn("[session] SESSION_SECRET missing or shorter than 32 chars: using a random per-boot secret (admin is logged out on restart).");
}
const secret = envSecret && envSecret.length >= 32 ? envSecret : randomBytes(32).toString("hex");
const secure = process.env.NODE_ENV === "production" && process.env.COOKIE_SECURE !== "false";

export const getAdminSession = (event: H3Event) =>
  useSession<AdminSessionData>(event, {
    name: "portfolio-admin",
    password: secret,
    maxAge: SESSION_HOURS * 3600,
    cookie: { httpOnly: true, sameSite: "strict", secure, path: "/" },
  });

export async function requireAdmin(event: H3Event) {
  const session = await getAdminSession(event);
  if (!session.data.authenticated) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  return session;
}

export async function requireCsrf(event: H3Event) {
  const session = await requireAdmin(event);
  if (!csrfMatches(session.data.csrf, getHeader(event, "x-csrf-token"))) {
    throw createError({ statusCode: 403, statusMessage: "Invalid CSRF token" });
  }
  return session;
}
