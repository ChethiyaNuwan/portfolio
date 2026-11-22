<script setup lang="ts">
// Desktop: vertical scrolling drives a horizontal pan across the panels (sticky pin + eased transform).
// Mobile / short screens / reduced motion: the same markup is a normal vertical page (CSS decides, see main.css).
// All panels are always present in the DOM in reading order, so nothing depends on the animation.
const QUERY = "(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";

const outer = ref<HTMLElement>();
const sticky = ref<HTMLElement>();
const track = ref<HTMLElement>();
const panels = ref<{ id: string; label: string }[]>([]);
const activeId = ref("");
const horizontal = ref(false);
const progress = ref(0);

let panelEls: HTMLElement[] = [];
let mq: MediaQueryList | null = null;
let ro: ResizeObserver | null = null;
let vw = 0;
let range = 0;
let outerTop = 0;
let target = 0;
let current = 0;
let raf = 0;

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

function measure() {
  if (!outer.value || !sticky.value || !track.value) return;
  vw = sticky.value.clientWidth;
  const vh = sticky.value.clientHeight;
  range = Math.max(0, track.value.scrollWidth - vw);
  outer.value.style.height = `${range + vh}px`;
  outerTop = outer.value.getBoundingClientRect().top + window.scrollY;
  readTarget();
  current = target;
  paint();
}

function readTarget() {
  target = clamp(window.scrollY - outerTop, 0, range);
}

function paint() {
  if (!track.value) return;
  track.value.style.transform = `translate3d(${-current}px,0,0)`;
  let best = 0;
  let bestId = activeId.value;
  for (const el of panelEls) {
    const center = el.offsetLeft + el.offsetWidth / 2 - current;
    const p = clamp(1 - Math.abs(center - vw / 2) / (vw * 0.9), 0, 1);
    el.style.setProperty("--panel-p", p.toFixed(3));
    if (p > best) {
      best = p;
      bestId = el.id;
    }
  }
  activeId.value = bestId;
  progress.value = range ? current / range : 0;
}

function tick() {
  raf = 0;
  const d = target - current;
  if (Math.abs(d) < 0.2) current = target;
  else current += d * 0.14;
  paint();
  if (current !== target) raf = requestAnimationFrame(tick);
}

function onScroll() {
  readTarget();
  if (!raf) raf = requestAnimationFrame(tick);
}

function jumpTo(id: string, behavior: ScrollBehavior = "smooth") {
  const el = panelEls.find((p) => p.id === id);
  if (!el) return;
  const x = clamp(el.offsetLeft, 0, range);
  window.scrollTo({ top: outerTop + x, behavior });
}

function step(dir: 1 | -1) {
  const i = panelEls.findIndex((p) => p.id === activeId.value);
  const next = panelEls[clamp(i + dir, 0, panelEls.length - 1)];
  if (next) jumpTo(next.id);
}

function isTyping(t: EventTarget | null) {
  const el = t as HTMLElement | null;
  return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || !!el.closest('[role="region"][aria-roledescription="carousel"], [role="dialog"]'));
}

function onKey(e: KeyboardEvent) {
  if (e.altKey || e.ctrlKey || e.metaKey || isTyping(e.target) || document.querySelector('[role="dialog"]')) return;
  if (e.key === "ArrowRight") (e.preventDefault(), step(1));
  else if (e.key === "ArrowLeft") (e.preventDefault(), step(-1));
  else if (e.key === "Home") (e.preventDefault(), jumpTo(panelEls[0]!.id));
  else if (e.key === "End") (e.preventDefault(), jumpTo(panelEls[panelEls.length - 1]!.id));
}

// Tabbing into a panel that is off-screen must bring it into view (and undo the browser's own overflow scrolling).
function onFocusIn(e: FocusEvent) {
  if (sticky.value) sticky.value.scrollLeft = 0;
  const panel = (e.target as HTMLElement).closest<HTMLElement>("[data-stage-panel]");
  if (panel && panel.id !== activeId.value) jumpTo(panel.id, "auto");
}
function onStickyScroll() {
  if (sticky.value && sticky.value.scrollLeft !== 0) sticky.value.scrollLeft = 0;
}

function onNavClick(e: MouseEvent, id: string) {
  if (!horizontal.value) return; // normal anchor behaviour
  e.preventDefault();
  jumpTo(id);
  history.replaceState(null, "", `#${id}`);
}

function enable() {
  if (horizontal.value) return;
  horizontal.value = true;
  measure();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("keydown", onKey);
  track.value?.addEventListener("focusin", onFocusIn);
  sticky.value?.addEventListener("scroll", onStickyScroll);
  ro = new ResizeObserver(measure);
  if (track.value) ro.observe(track.value);
  const hash = location.hash.slice(1);
  if (hash && panelEls.some((p) => p.id === hash)) requestAnimationFrame(() => jumpTo(hash, "auto"));
}

function disable() {
  if (!horizontal.value) return;
  horizontal.value = false;
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", measure);
  window.removeEventListener("keydown", onKey);
  track.value?.removeEventListener("focusin", onFocusIn);
  sticky.value?.removeEventListener("scroll", onStickyScroll);
  ro?.disconnect();
  cancelAnimationFrame(raf);
  raf = 0;
  if (outer.value) outer.value.style.height = "";
  if (track.value) track.value.style.transform = "";
  for (const el of panelEls) el.style.removeProperty("--panel-p");
}

function sync() {
  if (mq?.matches) enable();
  else disable();
}

onMounted(() => {
  panelEls = [...(track.value?.querySelectorAll<HTMLElement>("[data-stage-panel]") ?? [])];
  panels.value = panelEls.map((el) => ({ id: el.id, label: el.dataset.label ?? el.id }));
  activeId.value = panels.value[0]?.id ?? "";
  mq = window.matchMedia(QUERY);
  mq.addEventListener("change", sync);
  sync();
  document.fonts?.ready.then(() => horizontal.value && measure());
});

onBeforeUnmount(() => {
  mq?.removeEventListener("change", sync);
  disable();
});
</script>

<template>
  <div ref="outer" class="stage">
    <div ref="sticky" class="stage-sticky">
      <div ref="track" class="stage-track">
        <slot />
      </div>

      <nav class="stage-nav pointer-events-none absolute inset-x-0 bottom-0 z-10 flex-col gap-3 px-8 pb-5" aria-label="Sections on this page">
        <div class="pointer-events-auto h-px w-full bg-[var(--ui-border-accented)]" aria-hidden="true">
          <div class="h-px origin-left bg-[var(--ui-text-highlighted)]" :style="{ transform: `scaleX(${progress})` }" />
        </div>
        <ul class="pointer-events-auto flex flex-wrap gap-x-6 gap-y-1">
          <li v-for="p in panels" :key="p.id">
            <a
              :href="`#${p.id}`"
              class="text-sm transition-colors"
              :class="activeId === p.id ? 'text-highlighted' : 'text-muted hover:text-highlighted'"
              :aria-current="activeId === p.id ? 'true' : undefined"
              @click="onNavClick($event, p.id)"
            >
              {{ p.label }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
