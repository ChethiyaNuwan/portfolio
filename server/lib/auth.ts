import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export interface AdminConfig {
  username: string;
  passwordHash: string;
}

export const MIN_PASSWORD_LENGTH = 12;

export async function loadAdminConfig(env: Record<string, string | undefined>): Promise<AdminConfig> {
  const username = env.ADMIN_USERNAME?.trim();
  const password = env.ADMIN_PASSWORD;
  if (!username) throw new Error("Missing required environment variable: ADMIN_USERNAME");
  if (!password) throw new Error("Missing required environment variable: ADMIN_PASSWORD");
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters long`);
  }
  return { username, passwordHash: await Bun.password.hash(password) };
}

const digest = (s: string) => createHash("sha256").update(s).digest();

/** Always performs both checks so a wrong username and a wrong password follow the same path. */
export async function verifyCredentials(cfg: AdminConfig, username: string, password: string): Promise<boolean> {
  const userOk = timingSafeEqual(digest(cfg.username), digest(username ?? ""));
  const passOk = await Bun.password.verify(password ?? "", cfg.passwordHash).catch(() => false);
  return userOk && passOk;
}

export const newCsrfToken = (): string => randomBytes(32).toString("hex");

export function csrfMatches(a: string | undefined, b: string | undefined): boolean {
  if (!a || !b || a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
