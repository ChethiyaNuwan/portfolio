// A private way into the admin: there is no link to it anywhere on the site.
//  - touch screens: put two fingers on the page and keep them still for 1.2 seconds
//  - mouse: click the name in the footer five times quickly
// This is a convenience, not a lock: /admin is protected by the password (and passkeys) either way.
import { tickHaptic } from "~/utils/haptics";

const HOLD_MS = 1200;
const SLOP = 14; // px the fingers may drift before it counts as a gesture meant for something else
const CLICKS = 5;
const CLICK_WINDOW_MS = 1800;

export default defineNuxtPlugin(() => {
  const go = () => {
    tickHaptic("bump");
    navigateTo("/admin");
  };

  // two-finger hold
  let timer: ReturnType<typeof setTimeout> | undefined;
  let origin: { x: number; y: number }[] = [];
  const cancel = () => {
    clearTimeout(timer);
    timer = undefined;
  };
  const pts = (e: TouchEvent) => [...e.touches].map((t) => ({ x: t.clientX, y: t.clientY }));

  window.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length !== 2) return cancel();
      origin = pts(e);
      cancel();
      timer = setTimeout(go, HOLD_MS);
    },
    { passive: true },
  );
  window.addEventListener(
    "touchmove",
    (e) => {
      if (!timer) return;
      const now = pts(e);
      if (now.length !== 2 || now.some((p, i) => Math.hypot(p.x - origin[i]!.x, p.y - origin[i]!.y) > SLOP)) cancel();
    },
    { passive: true },
  );
  window.addEventListener("touchend", cancel, { passive: true });
  window.addEventListener("touchcancel", cancel, { passive: true });

  // five quick clicks on the name in the footer
  let clicks: number[] = [];
  window.addEventListener("click", (e) => {
    const target = e.target instanceof Element ? e.target.closest("footer a[href='/']") : null;
    if (!target) return;
    const now = Date.now();
    clicks = [...clicks.filter((t) => now - t < CLICK_WINDOW_MS), now];
    if (clicks.length >= CLICKS) {
      clicks = [];
      go();
    }
  });
});
