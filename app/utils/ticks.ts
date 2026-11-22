// Turns a stream of scroll / drag distances into "ticks", like the detents of a rotating crown: every `threshold`
// pixels of travel in one direction is one tick, so one long gesture produces many ticks.
export interface TickOptions {
  /** pixels of travel per tick */
  threshold: number;
  /** a pause longer than this ends the gesture; leftover travel is forgotten */
  quietMs: number;
  /** safety cap so one huge event cannot jump across the whole page */
  maxPerPush: number;
}

export function createTickAccumulator({ threshold, quietMs, maxPerPush }: TickOptions) {
  let acc = 0;
  let last = -Infinity;

  return {
    /** Add some travel. Returns the signed number of ticks it completed (positive = forward). */
    push(delta: number, now: number): number {
      if (!Number.isFinite(delta) || delta === 0) return 0;
      if (now - last > quietMs) acc = 0;
      last = now;
      if (acc !== 0 && Math.sign(delta) !== Math.sign(acc)) acc = 0;
      acc += delta;

      const sign = Math.sign(acc);
      const ticks = Math.min(maxPerPush, Math.floor(Math.abs(acc) / threshold));
      if (ticks === 0) return 0;
      acc = sign * (Math.abs(acc) % threshold); // keep the remainder, drop anything the cap discarded
      return sign * ticks;
    },
    reset() {
      acc = 0;
      last = -Infinity;
    },
  };
}
