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
  <div class="relative lg:h-[var(--h)]" :style="{ '--h': `${layout.height}px` }">
    <svg class="pointer-events-none absolute left-1/2 top-0 hidden -translate-x-1/2 lg:block" :width="W" :height="layout.height" :viewBox="`0 0 ${W} ${layout.height}`" aria-hidden="true">
      <line :x1="C" y1="0" :x2="C" :y2="layout.height" stroke="var(--ui-border-accented)" stroke-width="2" />

      <g v-for="it in layout.items" :key="it.id">
        <path :d="fork(laneX(it.side), it.yBottom)" fill="none" :stroke="color(it.lane)" stroke-width="3" stroke-linecap="round" />
        <line :x1="laneX(it.side)" :y1="it.yBottom - 26" :x2="laneX(it.side)" :y2="it.present ? it.yTop : it.yTop + 26" :stroke="color(it.lane)" stroke-width="3" stroke-linecap="round" />
        <path v-if="!it.present" :d="merge(laneX(it.side), it.yTop)" fill="none" :stroke="color(it.lane)" stroke-width="3" stroke-linecap="round" />

        <circle :cx="C" :cy="it.yBottom" r="5" :fill="color(it.lane)" stroke="var(--ui-bg)" stroke-width="2" />
        <circle v-if="!it.present" :cx="C" :cy="it.yTop" r="5" :fill="color(it.lane)" stroke="var(--ui-bg)" stroke-width="2" />

        <path :d="connector(it).path" fill="none" :stroke="color(it.lane)" stroke-width="2" stroke-dasharray="3 4" opacity="0.8" />
        <circle :cx="connector(it).x" :cy="connector(it).ay" r="5" :fill="color(it.lane)" stroke="var(--ui-bg)" stroke-width="2" />

        <template v-if="it.present">
          <circle :cx="laneX(it.side)" :cy="it.yTop" r="7" :fill="color(it.lane)" />
          <circle class="tree-pulse" :cx="laneX(it.side)" :cy="it.yTop" r="7" fill="none" :stroke="color(it.lane)" stroke-width="2" />
          <text :x="laneX(it.side) + (it.side === 'right' ? 16 : -16)" :y="it.yTop + 4" :text-anchor="it.side === 'right' ? 'start' : 'end'" font-size="11" fill="var(--ui-text-muted)">now</text>
        </template>
      </g>

      <g v-for="y in layout.years" :key="y.label">
        <rect :x="C - 22" :y="y.y - 9" width="44" height="18" rx="9" fill="var(--ui-bg)" stroke="var(--ui-border-accented)" />
        <text :x="C" :y="y.y + 4" text-anchor="middle" font-size="10" fill="var(--ui-text-muted)">{{ y.label }}</text>
      </g>
    </svg>

    <ol class="relative grid gap-5 max-lg:pl-8 max-lg:before:absolute max-lg:before:bottom-0 max-lg:before:left-2.5 max-lg:before:top-0 max-lg:before:w-0.5 max-lg:before:bg-[var(--ui-border-accented)] lg:block">
      <li
        v-for="it in layout.items"
        :key="it.id"
        class="relative flex flex-col gap-3 overflow-hidden border border-default border-t-2 bg-muted/40 p-5 max-lg:overflow-visible max-lg:before:absolute max-lg:before:-left-[1.72rem] max-lg:before:top-5 max-lg:before:size-3.5 max-lg:before:rounded-full max-lg:before:bg-[var(--lane)] max-lg:before:ring-4 max-lg:before:ring-[var(--ui-bg)] lg:absolute lg:top-[var(--y)] lg:h-[300px] lg:w-[calc(50%-138px)]"
        :class="it.side === 'right' ? 'lg:left-[calc(50%+138px)]' : 'lg:left-0'"
        :style="{ '--y': `${it.cardTop}px`, '--lane': color(it.lane), borderTopColor: color(it.lane) }"
      >
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <time class="font-medium text-toned">{{ byId[it.id]!.year }}</time>
          <span class="text-muted">{{ durationLabel(it.period) }}</span>
        </div>
        <div class="flex items-center gap-3">
          <img :src="byId[it.id]!.logo" alt="" class="size-10 shrink-0 border border-default bg-elevated p-1.5 object-contain" />
          <div class="min-w-0">
            <h3 class="font-display text-xl font-semibold leading-tight text-highlighted sm:text-2xl">{{ byId[it.id]!.title }}</h3>
            <p class="text-toned">{{ byId[it.id]!.company }}</p>
          </div>
        </div>
        <div v-if="byId[it.id]!.labels.length" class="flex flex-wrap gap-2">
          <UBadge v-for="l in byId[it.id]!.labels" :key="l" :label="l" color="neutral" variant="outline" />
        </div>
        <p class="min-h-0 text-sm leading-relaxed text-muted lg:line-clamp-4">{{ byId[it.id]!.description }}</p>
      </li>
    </ol>
  </div>
</template>
