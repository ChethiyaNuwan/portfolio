/**
 * A loop that moves a highlight from item to item ("box to box") while its container is on screen. Hovering or
 * focusing anything inside stops the loop so only what the visitor points at reacts; it picks up again a moment
 * after they leave. Does nothing for visitors who ask for reduced motion.
 *
 *   const { active, bind } = useCycle(root, () => items.length, { interval: 2400 });
 *   <div ref="root" v-bind="bind"> ... :class="{ 'is-on': active === i }"
 */
export function useCycle(
  el: Ref<HTMLElement | null | undefined>,
  count: () => number,
  opts: { interval?: number; resumeAfter?: number; eligible?: (i: number) => boolean; sequence?: () => number[]; startDelay?: number } = {},
) {
  const interval = opts.interval ?? 2600;
  const resumeAfter = opts.resumeAfter ?? 1400;
  // wait a moment after the section arrives: it is usually still sliding into place and should not start mid-scroll
  const startDelay = opts.startDelay ?? 900;
  const active = ref(-1);
  const visible = ref(false);
  const held = ref(false);
  let tick: ReturnType<typeof setInterval> | undefined;
  let release: ReturnType<typeof setTimeout> | undefined;
  let startTimer: ReturnType<typeof setTimeout> | undefined;
  let reduced = false;

  const stop = () => {
    clearInterval(tick);
    tick = undefined;
  };
  let pos = -1;
  function advance() {
    const n = count();
    if (n < 1) return;
    // `sequence` lets the caller choose the visiting order (e.g. left to right across the screen)
    const order = opts.sequence?.() ?? Array.from({ length: n }, (_, i) => i);
    for (let step = 1; step <= order.length; step++) {
      const p = (pos + step + order.length) % order.length;
      const next = order[p]!;
      if (!opts.eligible || opts.eligible(next)) {
        pos = p;
        active.value = next;
        return;
      }
    }
  }
  // `pos` is kept while the loop is stopped, so after a hover (or leaving and coming back) it carries on from the
  // item it had reached instead of starting over
  function sync(delay = 0) {
    stop();
    clearTimeout(startTimer);
    if (visible.value && !held.value && !reduced && count() > 1) {
      const run = () => {
        advance();
        tick = setInterval(advance, interval);
      };
      if (delay) startTimer = setTimeout(run, delay);
      else run();
    } else {
      active.value = -1;
    }
  }

  function pause() {
    clearTimeout(release);
    held.value = true;
  }
  function resume() {
    clearTimeout(release);
    release = setTimeout(() => (held.value = false), resumeAfter);
  }

  onMounted(() => {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const node = el.value;
    if (!node || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => (visible.value = !!e?.isIntersecting && e.intersectionRatio > 0.35), { threshold: [0, 0.35, 0.7] });
    io.observe(node);
    onBeforeUnmount(() => io.disconnect());
  });
  watch([visible, held], ([v], [wasVisible]) => sync(v && !wasVisible ? startDelay : 0));
  onBeforeUnmount(() => {
    stop();
    clearTimeout(release);
    clearTimeout(startTimer);
  });

  const bind = { onPointerenter: pause, onPointerleave: resume, onFocusin: pause, onFocusout: resume };
  return { active, bind, pause, resume };
}
