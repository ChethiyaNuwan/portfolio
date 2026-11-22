import { createLimiter } from "../lib/rateLimit";

export const loginLimiter = createLimiter({ max: 5, windowMs: 15 * 60_000, lockMs: 15 * 60_000 });
