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
const toggle = (id: string) => (openId.value = openId.value === id ? null : id);

// Phone tree: the trunk runs down the left edge; each role is a branch in its own lane, a little further from the trunk.
const TRUNK = 48; // px from the card edge to the trunk
const dx = (lane: number) => 14 + lane * 12; // trunk -> branch distance
const bx = (lane: number) => -TRUNK + dx(lane); // branch x, relative to the card

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

    <DropGroup as="ol" class="relative grid gap-5 max-md:pl-[3.75rem] md:max-lg:pl-8 md:max-lg:before:absolute md:max-lg:before:bottom-0 md:max-lg:before:left-2.5 md:max-lg:before:top-0 md:max-lg:before:w-0.5 md:max-lg:before:bg-[var(--ui-border-accented)] lg:block">
      <span class="exp-trunk pointer-events-none absolute bottom-0 left-[11px] top-0 w-0.5 bg-[var(--ui-border-accented)] md:hidden" aria-hidden="true" />
      <li
        v-for="(it, n) in layout.items"
        :key="it.id"
        class="drop relative flex flex-col gap-3 overflow-hidden border border-default border-t-2 bg-muted/40 p-5 max-lg:overflow-visible md:max-lg:before:absolute md:max-lg:before:-left-[1.72rem] md:max-lg:before:top-5 md:max-lg:before:size-3.5 md:max-lg:before:rounded-full md:max-lg:before:bg-[var(--lane)] md:max-lg:before:ring-4 md:max-lg:before:ring-[var(--ui-bg)] lg:absolute lg:top-[var(--y)] lg:h-[300px] lg:w-[calc(50%-138px)]"
        :class="it.side === 'right' ? 'lg:left-[calc(50%+138px)]' : 'lg:left-0'"
        :style="{ '--y': `${it.cardTop}px`, '--i': n, '--lane': color(it.lane), borderTopColor: color(it.lane) }"
      >
        <!-- phones: this role as a branch off the trunk on the left, joined to its card by a dashed line -->
        <span class="exp-branch pointer-events-none absolute -top-px bottom-0 w-[2.5px] bg-[var(--lane)] md:hidden" :style="{ left: `${bx(it.lane) - 1.25}px` }" aria-hidden="true" />
        <svg v-if="!it.present" class="exp-curve pointer-events-none absolute -top-[19px] overflow-visible md:hidden" :style="{ left: `${-TRUNK}px` }" :width="dx(it.lane)" height="19" aria-hidden="true">
          <path :d="`M${dx(it.lane)} 19 C${dx(it.lane)} 9, 0 10, 0 0`" fill="none" stroke="var(--lane)" stroke-width="2.5" stroke-linecap="round" />
          <circle cx="0" cy="0" r="4.5" fill="var(--lane)" stroke="var(--ui-bg)" stroke-width="2" />
        </svg>
        <span v-else class="exp-now pointer-events-none absolute -top-[6px] size-3 rounded-full bg-[var(--lane)] md:hidden" :style="{ left: `${bx(it.lane) - 6}px` }" aria-hidden="true" />
        <svg class="exp-curve pointer-events-none absolute -bottom-[19px] overflow-visible md:hidden" :style="{ left: `${-TRUNK}px` }" :width="dx(it.lane)" height="19" aria-hidden="true">
          <path :d="`M${dx(it.lane)} 0 C${dx(it.lane)} 10, 0 9, 0 19`" fill="none" stroke="var(--lane)" stroke-width="2.5" stroke-linecap="round" />
          <circle cx="0" cy="19" r="4.5" fill="var(--lane)" stroke="var(--ui-bg)" stroke-width="2" />
        </svg>
        <span class="exp-conn pointer-events-none absolute top-[3.4rem] border-t-2 border-dashed border-[var(--lane)] md:hidden" :style="{ left: `${bx(it.lane)}px`, width: `${-bx(it.lane)}px` }" aria-hidden="true" />
        <span class="pointer-events-none absolute top-[calc(3.4rem-4.5px)] size-[11px] rounded-full bg-[var(--lane)] ring-2 ring-[var(--ui-bg)] md:hidden" :style="{ left: `${bx(it.lane) - 5.5}px` }" aria-hidden="true" />
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
