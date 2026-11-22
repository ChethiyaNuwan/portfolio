<script setup lang="ts">
// Desktop: the sections sit side by side in a native horizontal scroll-snap container. Each section locks into place
// and scrolls vertically by itself when it has more content. Visitors move sideways with a horizontal swipe,
// Shift + scroll, the arrow keys, the footer links, or the edge buttons (and are hinted at all of these).
// Elsewhere (phones, short windows, reduced motion) the same markup is a normal vertical page (CSS decides).
const QUERY = "(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";

const scroller = ref<HTMLElement>();
const { panels, activeId, progress, horizontal, hinted } = useStageState();

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

function step(dir: 1 | -1) {
  const target = panels.value[index.value + dir];
  if (target) jumpTo(target.id);
}

function activeScroll(): HTMLElement | null {
  return panelEls.find((p) => p.id === activeId.value)?.querySelector<HTMLElement>(".stage-panel-scroll") ?? null;
}

function isTyping(t: EventTarget | null) {
  const el = t as HTMLElement | null;
  return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || !!el.closest('[role="region"][aria-roledescription="carousel"], [role="dialog"]'));
}

function onKey(e: KeyboardEvent) {
  if (e.altKey || e.ctrlKey || e.metaKey || isTyping(e.target) || document.querySelector('[role="dialog"]')) return;
  if (e.key === "ArrowRight") (e.preventDefault(), step(1));
  else if (e.key === "ArrowLeft") (e.preventDefault(), step(-1));
  else if (document.activeElement === document.body) {
    // nothing focused: let the arrow / page keys scroll the section that is in view
    const el = activeScroll();
    const amount: Record<string, number> = { ArrowDown: 80, ArrowUp: -80, PageDown: 0.85, PageUp: -0.85, " ": e.shiftKey ? -0.85 : 0.85 };
    const k = amount[e.key];
    if (el && k !== undefined) {
      e.preventDefault();
      el.scrollBy({ top: Math.abs(k) < 1 ? k * el.clientHeight : k, behavior: "smooth" });
    }
  }
}

// Horizontal wheel / trackpad / Shift+wheel: one gesture = one section. (Native snapping would snap small wheel
// movements back to where they started.) Momentum from the same gesture is ignored until the wheel goes quiet.
let wheelAcc = 0;
let wheelLocked = false;
let wheelTimer: ReturnType<typeof setTimeout> | undefined;

function onWheel(e: WheelEvent) {
  if (e.ctrlKey) return; // pinch zoom
  const dx = e.shiftKey ? e.deltaX || e.deltaY : e.deltaX;
  if (!e.shiftKey && Math.abs(dx) <= Math.abs(e.deltaY)) return; // vertical intent: scroll inside the section
  e.preventDefault();
  clearTimeout(wheelTimer);
  wheelTimer = setTimeout(() => {
    wheelLocked = false;
    wheelAcc = 0;
  }, 150);
  if (wheelLocked) return;
  wheelAcc += dx;
  if (Math.abs(wheelAcc) > 30) {
    step(wheelAcc > 0 ? 1 : -1);
    wheelLocked = true;
    wheelAcc = 0;
  }
}

function enable() {
  if (horizontal.value) return;
  horizontal.value = true;
  scroller.value?.addEventListener("scroll", onScroll, { passive: true });
  scroller.value?.addEventListener("wheel", onWheel, { passive: false });
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
  clearTimeout(wheelTimer);
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
