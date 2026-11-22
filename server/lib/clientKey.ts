/**
 * Key used for login rate limiting.
 * Behind a trusted reverse proxy we use the RIGHTMOST X-Forwarded-For entry, which is the one the proxy
 * appended; the leftmost entries are client-controlled and would let an attacker rotate keys.
 */
export function clientKey(opts: { forwardedFor: string | undefined; socketIp: string | undefined; trustProxy: boolean }): string {
  if (opts.trustProxy) {
    const parts = (opts.forwardedFor ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) return last;
  }
  return opts.socketIp || "unknown";
}
