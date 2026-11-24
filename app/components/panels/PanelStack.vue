<script setup lang="ts">
const content = await useContent();

// Tiles of different heights in columns, like pins. This section scrolls vertically if it does not fit.
const ASPECTS = ["aspect-square", "aspect-[4/5]", "aspect-[5/6]", "aspect-[3/4]", "aspect-[6/7]"];
const aspect = (i: number) => ASPECTS[(i * 3 + Math.floor(i / 5)) % ASPECTS.length];
const tilt = (i: number) => `${((i * 37) % 9) - 4}deg`;

// The loop shows each tile's hover look in turn; pointing at the grid stops it so only the hovered tile reacts.
const grid = ref<{ $el: HTMLElement } | HTMLElement>();
const gridEl = computed(() => (grid.value as { $el?: HTMLElement })?.$el ?? (grid.value as HTMLElement | undefined));
const { active, bind } = useCycle(gridEl, () => content.value.stack.length, { interval: 1700 });

// Touch screens have no hover: the first tap shows a tile's name, the second one follows the link.
const peek = ref<string | null>(null);
function onTile(e: MouseEvent, id: string) {
  if (!window.matchMedia("(hover: none)").matches) return;
  if (peek.value === id) return;
  e.preventDefault();
  peek.value = id;
}
</script>

<template>
  <StagePanel id="stack" label="Stack">
    <div class="flex min-h-full flex-col gap-8">
      <PanelHead id="stack" title="Stack">
        <p class="max-w-sm text-lg text-muted"><span class="hidden [@media(hover:hover)]:inline">Languages, frameworks and tools I use day to day. Hover a tile for its name.</span><span class="[@media(hover:hover)]:hidden">Languages, frameworks and tools I use day to day. Tap a tile for its name, tap again to open it.</span></p>
      </PanelHead>
      <DropGroup ref="grid" as="ul" class="columns-3 gap-3 sm:columns-4 md:columns-5 lg:columns-6" role="list" v-bind="bind">
        <li v-for="(s, i) in content.stack" :key="s.id" class="drop mb-3 break-inside-avoid" :style="{ '--i': i % 12, '--r': tilt(i) }">
          <a :href="s.link" target="_blank" rel="noopener noreferrer" class="pin flex items-center justify-center" :class="[aspect(i), peek === s.id && 'is-peek', active === i && 'is-on']" :aria-label="s.title" @click="onTile($event, s.id)" @blur="peek === s.id && (peek = null)">
            <img :src="s.logo" alt="" class="pin-media pin-logo size-[44%] max-w-20 object-contain" />
            <span class="pin-label">{{ s.title }}</span>
          </a>
        </li>
      </DropGroup>
    </div>
  </StagePanel>
</template>
