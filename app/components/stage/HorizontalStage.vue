<script setup lang="ts">
// The sections sit side by side in a native horizontal scroll-snap container (desktop, and any touch device). Each
// section locks into place and scrolls vertically by itself when it has more content.
// Sideways movement is "crown-like": a continuous gesture (trackpad, Shift + wheel, finger drag) is cut into ticks,
// one section per tick, so one long gesture can pass several sections, and each tick gives haptic feedback where the
// device allows (see utils/haptics.ts). Arrow keys, the footer links and the edge buttons step one section.
// Elsewhere (short desktop windows, reduced motion) the same markup is a normal vertical page (CSS decides).
import { KEYMAP, isMac, matchesAny, sectionDigit } from "~/utils/keybindings";
import { tickHaptic } from "~/utils/haptics";
import { createTickAccumulator } from "~/utils/ticks";

// Keep in sync with the @media rules in main.css
const QUERY =
  "(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference), (pointer: coarse) and (min-height: 420px) and (prefers-reduced-motion: no-preference)";

const scroller = ref<HTMLElement>();
const { panels, activeId, progress, horizontal, hinted, tickCount } = useStageState();

let panelEls: HTMLElement[] = [];
let mq: MediaQueryList | null = null;
let raf = 0;

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
const index = computed(() => panels.value.findIndex((p) => p.id === activeId.value));
const prev = computed(() => panels.value[index.value - 1]);
const next = computed(() => panels.value[index.value + 1]);

function paint() {
  raf = 0;
  const el = scroller.value;
  if (!el) return;
  const vw = el.clientWidth;
  const range = el.scrollWidth - vw;
  progress.value = range > 0 ? clamp(el.scrollLeft / range, 0, 1) : 0;
  let best = -1;
  let bestId = activeId.value;
  for (const p of panelEls) {
    const d = Math.abs(p.offsetLeft - el.scrollLeft);
    const v = clamp(1 - d / (vw * 0.9), 0, 1); // 1 when the section is in place, falls off as it slides away
    p.style.setProperty("--panel-p", v.toFixed(3));
    if (v > best) {
      best = v;
      bestId = p.id;
    }
  }
  if (bestId !== activeId.value && el.scrollLeft > 8) hinted.value = true;
  activeId.value = bestId;
}

function onScroll() {
  if (!raf) raf = requestAnimationFrame(paint);
}

function jumpTo(id: string) {
  const el = panelEls.find((p) => p.id === id);
  if (el && scroller.value) scroller.value.scrollTo({ left: el.offsetLeft, behavior: "smooth" });
  hinted.value = true;
}

// Moving by ticks: several ticks in quick succession keep moving forward from where the last one aimed, not from
// where the (still animating) scroll position currently is.
let pending: number | null = null;
let pendingTimer: ReturnType<typeof setTimeout> | undefined;
let lastBump = 0;

function move(dir: 1 | -1, haptic: boolean): boolean {
  const count = panels.value.length;
  if (!count) return false;
  const base = pending ?? Math.max(0, index.value);
  const nextIndex = clamp(base + dir, 0, count - 1);
  if (nextIndex === base) {
    // first / last section: a double pulse, at most once in a while so a long gesture does not buzz continuously
    if (haptic && performance.now() - lastBump > 500) {
      lastBump = performance.now();
      tickHaptic("bump");
    }
    return false;
  }
  pending = nextIndex;
  clearTimeout(pendingTimer);
  pendingTimer = setTimeout(() => (pending = null), 900);
  jumpTo(panels.value[nextIndex]!.id);
  tickCount.value++;
  if (haptic) tickHaptic("tick");
  return true;
}

const step = (dir: 1 | -1) => move(dir, false);

function activeScroll(): HTMLElement | null {
  return panelEls.find((p) => p.id === activeId.value)?.querySelector<HTMLElement>(".stage-panel-scroll") ?? null;
}

function isTyping(t: EventTarget | null) {
  const el = t instanceof HTMLElement ? t : null; // window / document (synthetic events) are never "typing"
  return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || !!el.closest('[role="region"][aria-roledescription="carousel"], [role="dialog"]'));
}

function onKey(e: KeyboardEvent) {
  if (isTyping(e.target) || document.querySelector('[role="dialog"]')) return;
  const mac = isMac();

  if (matchesAny(e, KEYMAP.next, mac)) return (e.preventDefault(), step(1));
  if (matchesAny(e, KEYMAP.prev, mac)) return (e.preventDefault(), step(-1));

  const digit = sectionDigit(e);
  const target = digit === null ? undefined : panels.value[digit];
  if (target) return (e.preventDefault(), jumpTo(target.id));

  const el = activeScroll();
  if (!el) return;
  // vim-style j / k scroll the section in view; with nothing focused, the arrow and page keys do too
  if (matchesAny(e, KEYMAP.scrollDown, mac)) return (e.preventDefault(), el.scrollBy({ top: 90, behavior: "smooth" }));
  if (matchesAny(e, KEYMAP.scrollUp, mac)) return (e.preventDefault(), el.scrollBy({ top: -90, behavior: "smooth" }));
  if (document.activeElement === document.body && !e.altKey && !e.ctrlKey && !e.metaKey) {
    const amount: Record<string, number> = { ArrowDown: 80, ArrowUp: -80, PageDown: 0.85, PageUp: -0.85, " ": e.shiftKey ? -0.85 : 0.85 };
    const k = amount[e.key];
    if (k !== undefined) {
      e.preventDefault();
      el.scrollBy({ top: Math.abs(k) < 1 ? k * el.clientHeight : k, behavior: "smooth" });
    }
  }
}

// Wheel / trackpad / Shift + wheel: every 90px of horizontal travel is one tick. Trackpad momentum keeps ticking as it
// slows down, like a flicked crown; a mouse wheel notch (about 100px) is one tick.
const wheelTicks = createTickAccumulator({ threshold: 90, quietMs: 150, maxPerPush: 4 });

function onWheel(e: WheelEvent) {
  if (e.ctrlKey) return; // pinch zoom
  const dx = e.shiftKey ? e.deltaX || e.deltaY : e.deltaX;
  // vertical intent: let the section scroll normally
  if (!e.shiftKey && Math.abs(dx) < Math.abs(e.deltaY) * 0.75) return;
  if (!dx) return;
  e.preventDefault();
  const n = wheelTicks.push(dx, performance.now());
  for (let i = 0; i < Math.abs(n); i++) move(n > 0 ? 1 : -1, true);
}

// Touch: dragging sideways ticks every 80px of finger travel (the browser only pans vertically, see touch-action);
// a quick flick adds a few more ticks, like spinning a crown.
const touchTicks = createTickAccumulator({ threshold: 80, quietMs: 600, maxPerPush: 3 });
let touch: { x: number; y: number; t: number; lastX: number; dragging: boolean; ticks: number } | null = null;
let flickTimers: ReturnType<typeof setTimeout>[] = [];

function onTouchStart(e: TouchEvent) {
  const t = e.touches[0];
  flickTimers.forEach(clearTimeout);
  flickTimers = [];
  touchTicks.reset();
  touch = t ? { x: t.clientX, y: t.clientY, t: performance.now(), lastX: t.clientX, dragging: false, ticks: 0 } : null;
}

function onTouchMove(e: TouchEvent) {
  const t = e.touches[0];
  if (!touch || !t) return;
  const dx = t.clientX - touch.lastX;
  touch.lastX = t.clientX;
  if (!touch.dragging) {
    const totalX = t.clientX - touch.x;
    const totalY = t.clientY - touch.y;
    if (Math.abs(totalX) > 12 && Math.abs(totalX) > Math.abs(totalY) * 1.2) touch.dragging = true;
    else return;
  }
  const n = touchTicks.push(-dx, performance.now()); // finger moving left = forward
  for (let i = 0; i < Math.abs(n); i++) if (move(n > 0 ? 1 : -1, true)) touch.ticks++;
}

function onTouchEnd(e: TouchEvent) {
  const start = touch;
  touch = null;
  const t = e.changedTouches[0];
  if (!start || !t) return;
  const dx = t.clientX - start.x;
  const dy = t.clientY - start.y;
  if (Math.abs(dx) < 16 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
  const dir = dx < 0 ? 1 : -1;
  const velocity = Math.abs(dx) / Math.max(1, performance.now() - start.t); // px per ms
  if (start.ticks === 0) move(dir, true); // a short swipe is still one tick
  const extra = Math.min(3, Math.floor(velocity / 1.1)); // a hard flick keeps spinning
  for (let i = 0; i < extra; i++) flickTimers.push(setTimeout(() => move(dir, true), 130 * (i + 1)));
}

function enable() {
  if (horizontal.value) return;
  horizontal.value = true;
  scroller.value?.addEventListener("scroll", onScroll, { passive: true });
  scroller.value?.addEventListener("wheel", onWheel, { passive: false });
  scroller.value?.addEventListener("touchstart", onTouchStart, { passive: true });
  scroller.value?.addEventListener("touchmove", onTouchMove, { passive: true });
  scroller.value?.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("keydown", onKey);
  window.addEventListener("resize", onScroll);
  const hash = location.hash.slice(1);
  if (hash && panelEls.some((p) => p.id === hash)) {
    const el = panelEls.find((p) => p.id === hash)!;
    scroller.value?.scrollTo({ left: el.offsetLeft, behavior: "instant" as ScrollBehavior });
  }
  paint();
}

function disable() {
  if (!horizontal.value) return;
  horizontal.value = false;
  scroller.value?.removeEventListener("scroll", onScroll);
  scroller.value?.removeEventListener("wheel", onWheel);
  scroller.value?.removeEventListener("touchstart", onTouchStart);
  scroller.value?.removeEventListener("touchmove", onTouchMove);
  scroller.value?.removeEventListener("touchend", onTouchEnd);
  flickTimers.forEach(clearTimeout);
  clearTimeout(pendingTimer);
  window.removeEventListener("keydown", onKey);
  window.removeEventListener("resize", onScroll);
  cancelAnimationFrame(raf);
  raf = 0;
  for (const el of panelEls) el.style.removeProperty("--panel-p");
}

function sync() {
  if (mq?.matches) enable();
  else disable();
}

onMounted(() => {
  panelEls = [...(scroller.value?.querySelectorAll<HTMLElement>("[data-stage-panel]") ?? [])];
  panels.value = panelEls.map((el) => ({ id: el.id, label: el.dataset.label ?? el.id }));
  activeId.value = panels.value[0]?.id ?? "";
  registerStageJump(jumpTo);
  mq = window.matchMedia(QUERY);
  mq.addEventListener("change", sync);
  sync();
});

onBeforeUnmount(() => {
  mq?.removeEventListener("change", sync);
  disable();
  registerStageJump(null);
  panels.value = [];
  activeId.value = "";
  progress.value = 0;
});
</script>

<template>
  <div class="stage">
    <div ref="scroller" class="stage-scroller">
      <slot />
    </div>
    <StageControls v-if="horizontal" :prev="prev" :next="next" :hinted="hinted" @go="step" />
  </div>
</template>
