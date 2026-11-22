export interface Limiter {
  check(key: string): { allowed: boolean; retryAfterMs: number };
  fail(key: string): void;
  reset(key: string): void;
}

interface Options {
  max: number;
  windowMs: number;
  lockMs: number;
  now?: () => number;
}

export function createLimiter({ max, windowMs, lockMs, now = Date.now }: Options): Limiter {
  const failures = new Map<string, number[]>();
  const lockedUntil = new Map<string, number>();

  return {
    check(key) {
      const until = lockedUntil.get(key);
      if (until !== undefined) {
        const remaining = until - now();
        if (remaining > 0) return { allowed: false, retryAfterMs: remaining };
        lockedUntil.delete(key);
        failures.delete(key);
      }
      return { allowed: true, retryAfterMs: 0 };
    },
    fail(key) {
      const t = now();
      const recent = (failures.get(key) ?? []).filter((x) => t - x < windowMs);
      recent.push(t);
      failures.set(key, recent);
      if (recent.length >= max) lockedUntil.set(key, t + lockMs);
    },
    reset(key) {
      failures.delete(key);
      lockedUntil.delete(key);
    },
  };
}
