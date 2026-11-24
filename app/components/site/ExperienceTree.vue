<script setup lang="ts">
// Experience drawn as a git graph: a trunk, with one branch per role. A branch forks off at the start date and
// merges back at the end date, and its length is proportional to how long the role lasted. Open-ended roles keep
// an open tip ("now"). Cards alternate sides. On small screens it is a plain list of cards.
import { durationLabel, layoutTree, parsePeriod } from "~/utils/timeline";

const content = await useContent();
const now = new Date();

const OPTS = { pxPerMonth: 20, cardHeight: 300, cardGap: 24, minBranch: 64, padTop: 48, padBottom: 40 };
const W = 260; // width of the graph column
const C = W / 2; // trunk x
const LANE = 62; // lane offset from the trunk

const byId = computed(() => Object.fromEntries(content.value.experience.map((e) => [e.id, e])));
const layout = computed(() =>
  layoutTree(
    content.value.experience.map((e) => ({ id: e.id, period: parsePeriod(e.year, now) })),
    now,
    OPTS,
  ),
);

// On phones the cards collapse to their title; one is open at a time, the top one at load
const openId = ref<string | null>(layout.value.items[0]?.id ?? null);
const compact = ref(false);
onMounted(() => {
  const mq = window.matchMedia("(max-width: 767px)");
  compact.value = mq.matches;
  mq.addEventListener("change", (e) => (compact.value = e.matches));
});
const toggle = (id: string) => {
  openId.value = openId.value === id ? null : id;
  if (openId.value) track("experience_open", { role: id });
};

// Phone tree: a real git graph beside the list. Cards are rows, newest first. The trunk runs down the left; each role
// is a branch that merges into the trunk above its card (or stays open if it is current) and forks off again below the
// last row that is still inside its period, so roles that overlapped in time run side by side in separate lanes.
const rootEl = ref<HTMLElement>();
const rows = ref<{ top: number; bottom: number; left: number }[]>([]);
const TX = 12; // trunk x
const LANE0 = 28;
const LANE_STEP = 11;

function listItems(): HTMLElement[] {
  return [...(rootEl.value?.querySelectorAll<HTMLElement>("ol > li") ?? [])];
}
function measure() {
  rows.value = listItems().map((li) => ({ top: li.offsetTop, bottom: li.offsetTop + li.offsetHeight, left: li.offsetLeft }));
}
let ro: ResizeObserver | undefined;
onMounted(() => {
  measure();
  ro = new ResizeObserver(measure); // the cards animate open and closed: follow them frame by frame
  const ol = rootEl.value?.querySelector("ol");
  if (ol) ro.observe(ol);
  listItems().forEach((li) => ro!.observe(li));
});
onBeforeUnmount(() => ro?.disconnect());

const branches = computed(() => {
  const its = layout.value.items;
  // last row index still inside each role's period (rows are sorted by end date, newest first)
  const spans = its.map((it, i) => {
    let j = i;
    for (let k = i + 1; k < its.length; k++) if (its[k]!.period.end >= it.period.start) j = k;
    return { from: i, to: j };
  });
  const laneEnd: number[] = [];
  return its.map((it, i) => {
    const span = spans[i]!;
    let lane = laneEnd.findIndex((end) => end < span.from);
    if (lane < 0) lane = laneEnd.length;
    laneEnd[lane] = span.to;
    return { id: it.id, present: it.present, color: color(it.lane), lane, ...span };
  });
});

const trunkHeight = computed(() => rows.value.at(-1)?.bottom ?? 0);
const paths = computed(() =>
  branches.value.flatMap((b, n) => {
    const top = rows.value[b.from];
    const bottom = rows.value[b.to];
    if (!top || !bottom) return [];
    const x = LANE0 + b.lane * LANE_STEP;
    const y0 = top.top - 9;
    const y1 = bottom.bottom + 9;
    const start = b.present ? `M ${x} 6` : `M ${TX} ${y0} C ${TX} ${y0 + 9}, ${x} ${y0 + 5}, ${x} ${y0 + 15}`;
    const d = `${start} L ${x} ${y1 - 15} C ${x} ${y1 - 5}, ${TX} ${y1 - 9}, ${TX} ${y1}`;
    return [{ id: b.id, n, color: b.color, d, x, cy: top.top + 54, left: top.left, present: b.present, y0, y1 }];
  }),
);

// The branch ball is positioned from the same linear-in-y clock as the avatar (not along the path, whose length is not
// proportional to height), so both reach every row at the same moment.
function ball(p: { x: number; y0: number; y1: number; present: boolean }) {
  const pts: [number, number][] = [[p.y1, TX], [Math.max(p.y1 - 12, p.y0 + 12), p.x]];
  if (p.present) pts.push([6, p.x]);
  else pts.push([Math.min(p.y0 + 12, p.y1 - 12), p.x], [p.y0, TX]);
  const t: number[] = [];
  pts.forEach(([y], i) => t.push(Math.max(fm(y), i ? t[i - 1]! + 0.0005 : 0.005)));
  const last = Math.min(t.at(-1)!, 0.998);
  const times = [0, ...t.map((v) => Math.min(v, 0.998)), 1];
  return {
    kt: times.map((v) => v.toFixed(4)).join(";"),
    cx: [pts[0]![1], ...pts.map(([, x]) => x), pts.at(-1)![1]],
    cy: [pts[0]![0], ...pts.map(([y]) => y), pts.at(-1)![0]],
    ot: `0;${t[0]!.toFixed(4)};${last.toFixed(4)}`,
  };
}

// Loop: your avatar rides up the trunk (bottom to top) with a pulsing ring, a coloured ball follows each branch while
// the avatar is level with it, years light up as it passes, and the role it is passing lights up. The motion is SVG
// animation (all on one clock); a light poll reads that clock to know which role to highlight.
const motionOk = ref(false);
const active = ref<number[]>([]); // every role the avatar is level with (overlapping roles glow together)
const deskSvg = ref<SVGSVGElement>();
const mobSvg = ref<SVGSVGElement>();
const avatar = computed(() => content.value.profile.avatar);
// One loop = the climb, a short rest at the top, and a new start at the bottom. The avatar pops in at the bottom and
// bursts out at the top (it does not just fade).
const HOLD = 1.2;
const TOP_D = 28; // where the avatar stops on the desktop tree (clear of the svg edge)
const TOP_M = 15;
const travelSeconds = (h: number) => Math.max(8, h / 55);
const T = computed(() => travelSeconds(layout.value.height) + HOLD);
const TM = computed(() => travelSeconds(trunkHeight.value) + HOLD);
const travelFrac = (h: number) => travelSeconds(h) / (travelSeconds(h) + HOLD);
// loop fraction (0..1) at which the avatar is level with y, for a trunk of height h that the avatar climbs to `top`
const fracAt = (y: number, h: number, top: number) => Math.min(travelFrac(h) - 0.005, Math.max(0.005, (travelFrac(h) * (h - y)) / (h - top)));
const fd = (y: number) => fracAt(y, layout.value.height, TOP_D);
const fm = (y: number) => fracAt(y, trunkHeight.value, TOP_M);
// the avatar's size over one loop: pops in, rides, bursts and vanishes at the top
const popTimes = (h: number) => `0;0.05;0.09;${travelFrac(h)};${(travelFrac(h) + (1 - travelFrac(h)) * 0.4).toFixed(4)};1`;
const POP = "0;1.25;1;1;1.45;0";
const litYear = ref("");
let poll: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  motionOk.value = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!motionOk.value) return;
  poll = setInterval(() => {
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const svg = desktop ? deskSvg.value : window.matchMedia("(max-width: 767px)").matches ? mobSvg.value : undefined;
    if (!svg || !svg.getCurrentTime) return void (active.value = []);
    const h = desktop ? layout.value.height : trunkHeight.value;
    const dur = desktop ? T.value : TM.value;
    const top = desktop ? TOP_D : TOP_M;
    const y = h - (h - top) * Math.min(1, (svg.getCurrentTime() % dur) / travelSeconds(h));
    litYear.value = desktop ? (layout.value.years.find((yr) => Math.abs(yr.y - y) < 20)?.label ?? "") : "";
    const spans = desktop ? layout.value.items.map((it) => [it.yTop, it.yBottom] as const) : rows.value.map((r) => [r.top, r.bottom] as const);
    const on: number[] = [];
    spans.forEach(([top, bottom], i) => {
      if (y >= top - 8 && y <= bottom + 8) on.push(i);
    });
    const prev = active.value;
    if (on.length !== prev.length || on.some((v, i) => v !== prev[i])) active.value = on;
  }, 80);
});
onBeforeUnmount(() => clearInterval(poll));

const branchPath = (it: (typeof layout.value.items)[number]) => {
  const x = laneX(it.side);
  const tail = it.present ? `L ${x} ${it.yTop}` : `L ${x} ${it.yTop + 26} C ${x} ${it.yTop + 12}, ${C} ${it.yTop + 14}, ${C} ${it.yTop}`;
  return `M ${C} ${it.yBottom} C ${C} ${it.yBottom - 14}, ${x} ${it.yBottom - 12}, ${x} ${it.yBottom - 26} ${tail}`;
};

const laneX = (side: "left" | "right") => (side === "right" ? C + LANE : C - LANE);
const color = (lane: number) => `var(--lane-${lane + 1})`;
const fork = (x: number, y: number) => `M ${C} ${y} C ${C} ${y - 14}, ${x} ${y - 12}, ${x} ${y - 26}`;
const merge = (x: number, y: number) => `M ${x} ${y + 26} C ${x} ${y + 12}, ${C} ${y + 14}, ${C} ${y}`;

function connector(it: (typeof layout.value.items)[number]) {
  const x = laneX(it.side);
  const edge = it.side === "right" ? W : 0;
  const dir = it.side === "right" ? 1 : -1;
  const cy = it.cardTop + 44;
  const ay = Math.min(it.yBottom - 30, Math.max(it.yTop + 30, cy));
  return { ay, x, path: `M ${x} ${ay} C ${x + dir * 30} ${ay}, ${edge - dir * 30} ${cy}, ${edge} ${cy}` };
}
</script>

<template>
  <div ref="rootEl" class="relative lg:h-[var(--h)]" :style="{ '--h': `${layout.height}px` }">
    <svg ref="deskSvg" class="pointer-events-none absolute left-1/2 top-0 hidden -translate-x-1/2 overflow-visible lg:block" :width="W" :height="layout.height" :viewBox="`0 0 ${W} ${layout.height}`" aria-hidden="true">
      <line :x1="C" y1="0" :x2="C" :y2="layout.height" stroke="var(--ui-border-accented)" stroke-width="2" />
      <g v-if="motionOk" class="tree-ball">
        <animateMotion :dur="`${T}s`" repeatCount="indefinite" :path="`M 0 ${layout.height} L 0 ${TOP_D}`" keyPoints="0;1;1" :keyTimes="`0;${travelFrac(layout.height)};1`" calcMode="linear" />
        <g :transform="`translate(${C} 0)`">
          <animateTransform attributeName="transform" type="scale" additive="sum" :dur="`${T}s`" repeatCount="indefinite" :values="POP" :keyTimes="popTimes(layout.height)" />
          <circle r="16" fill="none" stroke="var(--ui-primary)" stroke-width="2">
            <animate attributeName="r" values="16;30" dur="1.3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.85;0" dur="1.3s" repeatCount="indefinite" />
          </circle>
          <clipPath id="tree-avatar-clip"><circle r="15" /></clipPath>
          <circle r="17" fill="var(--ui-bg)" stroke="var(--ui-primary)" stroke-width="2.5" />
          <image :href="avatar" x="-36" y="-33" width="66" height="82" preserveAspectRatio="none" clip-path="url(#tree-avatar-clip)" />
        </g>
      </g>

      <g v-for="(it, n) in layout.items" :key="it.id" :style="{ '--glow': color(it.lane) }">
        <g :class="active.includes(n) && 'tree-glow'">
          <path :d="fork(laneX(it.side), it.yBottom)" fill="none" :stroke="color(it.lane)" :stroke-width="active.includes(n) ? 4 : 3" stroke-linecap="round" />
          <line :x1="laneX(it.side)" :y1="it.yBottom - 26" :x2="laneX(it.side)" :y2="it.present ? it.yTop : it.yTop + 26" :stroke="color(it.lane)" :stroke-width="active.includes(n) ? 4 : 3" stroke-linecap="round" />
          <path v-if="!it.present" :d="merge(laneX(it.side), it.yTop)" fill="none" :stroke="color(it.lane)" :stroke-width="active.includes(n) ? 4 : 3" stroke-linecap="round" />
        </g>

        <circle :cx="C" :cy="it.yBottom" r="5" :fill="color(it.lane)" stroke="var(--ui-bg)" stroke-width="2" />
        <circle v-if="!it.present" :cx="C" :cy="it.yTop" r="5" :fill="color(it.lane)" stroke="var(--ui-bg)" stroke-width="2" />

        <path :d="connector(it).path" fill="none" :stroke="color(it.lane)" stroke-width="2" stroke-dasharray="3 4" opacity="0.8" class="tree-flow" />
        <circle :cx="connector(it).x" :cy="connector(it).ay" r="5" :fill="color(it.lane)" stroke="var(--ui-bg)" stroke-width="2" />

        <circle v-if="motionOk" r="6" :fill="color(it.lane)" stroke="var(--ui-bg)" stroke-width="2" opacity="0">
          <animateMotion :dur="`${T}s`" repeatCount="indefinite" :path="branchPath(it)" keyPoints="0;0;1;1" :keyTimes="`0;${fd(it.yBottom)};${fd(it.yTop)};1`" calcMode="linear" />
          <animate attributeName="opacity" :dur="`${T}s`" repeatCount="indefinite" values="0;0;1;1;0;0" :keyTimes="`0;${fd(it.yBottom)};${fd(it.yBottom) + 0.005};${fd(it.yTop)};${Math.min(0.995, fd(it.yTop) + 0.005)};1`" />
        </circle>

        <template v-if="it.present">
          <circle :cx="laneX(it.side)" :cy="it.yTop" r="7" :fill="color(it.lane)" />
          <circle class="tree-pulse" :cx="laneX(it.side)" :cy="it.yTop" r="7" fill="none" :stroke="color(it.lane)" stroke-width="2" />
          <text :x="laneX(it.side) + (it.side === 'right' ? 16 : -16)" :y="it.yTop + 4" :text-anchor="it.side === 'right' ? 'start' : 'end'" font-size="11" fill="var(--ui-text-muted)">now</text>
        </template>
      </g>

      <g v-for="y in layout.years" :key="y.label" class="year-pill" :class="litYear === y.label && 'is-lit'">
        <rect :x="C - 22" :y="y.y - 9" width="44" height="18" rx="9" fill="var(--ui-bg)" stroke="var(--ui-border-accented)" />
        <text :x="C" :y="y.y + 4" text-anchor="middle" font-size="10" fill="var(--ui-text-muted)">{{ y.label }}</text>
      </g>
    </svg>

    <DropGroup as="ol" class="relative grid gap-5 max-md:pl-[3.75rem] md:max-lg:pl-8 md:max-lg:before:absolute md:max-lg:before:bottom-0 md:max-lg:before:left-2.5 md:max-lg:before:top-0 md:max-lg:before:w-0.5 md:max-lg:before:bg-[var(--ui-border-accented)] lg:block">
      <svg v-if="rows.length" ref="mobSvg" class="exp-graph pointer-events-none absolute left-0 top-0 overflow-visible md:hidden" width="60" :height="trunkHeight" aria-hidden="true">
        <line class="exp-trunk" :x1="TX" y1="0" :x2="TX" :y2="trunkHeight" stroke="var(--ui-border-accented)" stroke-width="2" />
        <g v-if="motionOk" class="tree-ball">
          <animateMotion :dur="`${TM}s`" repeatCount="indefinite" :path="`M 0 ${trunkHeight} L 0 ${TOP_M}`" keyPoints="0;1;1" :keyTimes="`0;${travelFrac(trunkHeight)};1`" calcMode="linear" />
          <g :transform="`translate(${TX} 0)`">
            <animateTransform attributeName="transform" type="scale" additive="sum" :dur="`${TM}s`" repeatCount="indefinite" :values="POP" :keyTimes="popTimes(trunkHeight)" />
            <circle r="11" fill="none" stroke="var(--ui-primary)" stroke-width="2">
              <animate attributeName="r" values="11;22" dur="1.3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.85;0" dur="1.3s" repeatCount="indefinite" />
            </circle>
            <clipPath id="tree-avatar-clip-m"><circle r="10" /></clipPath>
            <circle r="12" fill="var(--ui-bg)" stroke="var(--ui-primary)" stroke-width="2" />
            <image :href="avatar" x="-24" y="-22" width="44" height="55" preserveAspectRatio="none" clip-path="url(#tree-avatar-clip-m)" />
          </g>
        </g>
        <g v-for="p in paths" :key="p.id" :class="{ 'is-on': active.includes(p.n) }" :style="{ '--i': p.n, '--glow': p.color }">
          <path class="exp-path" pathLength="1" :d="p.d" fill="none" :stroke="p.color" stroke-width="2.5" stroke-linecap="round" />
          <circle v-if="!p.present" class="exp-dot" :cx="TX" :cy="p.y0" r="4.5" :fill="p.color" stroke="var(--ui-bg)" stroke-width="2" />
          <circle class="exp-dot" :cx="TX" :cy="p.y1" r="4.5" :fill="p.color" stroke="var(--ui-bg)" stroke-width="2" />
          <circle v-if="p.present" class="exp-dot exp-now" :cx="p.x" :cy="6" r="5" :fill="p.color" />
          <circle v-if="motionOk" r="5" :fill="p.color" stroke="var(--ui-bg)" stroke-width="1.5" opacity="0" :cx="ball(p).cx[0]" :cy="ball(p).cy[0]">
            <animate attributeName="cx" :dur="`${TM}s`" repeatCount="indefinite" :values="ball(p).cx.join(';')" :keyTimes="ball(p).kt" calcMode="linear" />
            <animate attributeName="cy" :dur="`${TM}s`" repeatCount="indefinite" :values="ball(p).cy.join(';')" :keyTimes="ball(p).kt" calcMode="linear" />
            <animate attributeName="opacity" :dur="`${TM}s`" repeatCount="indefinite" values="0;1;0" :keyTimes="ball(p).ot" calcMode="discrete" />
          </circle>
          <line class="exp-dash" :x1="p.x" :y1="p.cy" :x2="p.left" :y2="p.cy" :stroke="p.color" stroke-width="2" stroke-dasharray="3 4" />
          <circle class="exp-dot" :cx="p.x" :cy="p.cy" r="4.5" :fill="p.color" stroke="var(--ui-bg)" stroke-width="2" />
        </g>
      </svg>
      <li
        v-for="(it, n) in layout.items"
        :key="it.id"
        class="drop exp-card relative flex flex-col gap-3 overflow-hidden border border-default border-t-2 bg-muted/40 p-5 max-lg:overflow-visible md:max-lg:before:absolute md:max-lg:before:-left-[1.72rem] md:max-lg:before:top-5 md:max-lg:before:size-3.5 md:max-lg:before:rounded-full md:max-lg:before:bg-[var(--lane)] md:max-lg:before:ring-4 md:max-lg:before:ring-[var(--ui-bg)] lg:absolute lg:top-[var(--y)] lg:h-[300px] lg:w-[calc(50%-138px)]"
        :class="[it.side === 'right' ? 'lg:left-[calc(50%+138px)]' : 'lg:left-0', active.includes(n) && 'is-on']"
        :style="{ '--y': `${it.cardTop}px`, '--i': n, '--lane': color(it.lane), borderTopColor: color(it.lane) }"
      >
        <component
          :is="compact ? 'button' : 'div'"
          :type="compact ? 'button' : undefined"
          :aria-expanded="compact ? openId === it.id : undefined"
          :aria-controls="compact ? `exp-${it.id}` : undefined"
          class="flex w-full flex-col gap-3 text-left max-md:cursor-pointer"
          @click="compact && toggle(it.id)"
        >
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <time class="font-medium text-toned">{{ byId[it.id]!.year }}</time>
            <span class="text-muted">{{ durationLabel(it.period) }}</span>
          </div>
          <div class="flex items-center gap-3">
            <img :src="byId[it.id]!.logo" alt="" class="size-10 shrink-0 border border-default bg-elevated p-1.5 object-contain" />
            <div class="min-w-0 flex-1">
              <h3 class="font-display text-xl font-semibold leading-tight text-highlighted sm:text-2xl">{{ byId[it.id]!.title }}</h3>
              <p class="text-toned">{{ byId[it.id]!.company }}</p>
            </div>
            <UIcon name="i-lucide-chevron-down" class="size-5 shrink-0 text-muted transition-transform md:hidden" :class="openId === it.id && 'rotate-180'" aria-hidden="true" />
          </div>
        </component>
        <div :id="`exp-${it.id}`" class="exp-body min-h-0" :data-open="openId === it.id">
          <div class="flex min-h-0 flex-col gap-3">
            <div v-if="byId[it.id]!.labels.length" class="flex flex-wrap gap-2">
              <UBadge v-for="l in byId[it.id]!.labels" :key="l" :label="l" color="neutral" variant="outline" />
            </div>
            <p class="min-h-0 text-sm leading-relaxed text-muted lg:line-clamp-4">{{ byId[it.id]!.description }}</p>
          </div>
        </div>
      </li>
    </DropGroup>
  </div>
</template>
