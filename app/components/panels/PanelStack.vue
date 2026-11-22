<script setup lang="ts">
const content = await useContent();

// Three tiles per column; each column has its own row proportions, so tile heights vary like pins.
const columns = computed(() => {
  const cols: (typeof content.value.stack)[] = [];
  for (let i = 0; i < content.value.stack.length; i += 3) cols.push(content.value.stack.slice(i, i + 3));
  return cols;
});
const PATTERNS = ["3fr 2fr 3fr", "2fr 3fr 2fr", "3fr 3fr 2fr", "2fr 2fr 3fr"];
const rows = (ci: number) => PATTERNS[ci % PATTERNS.length];
const tilt = (i: number) => `${((i * 37) % 9) - 4}deg`;
</script>

<template>
  <StagePanel id="stack" label="Stack" wide="max-content">
    <div class="flex h-full flex-col gap-8 stage:flex-row stage:gap-10">
      <div class="flex flex-col justify-between gap-4 stage:w-[24vw] stage:shrink-0">
        <KineticText id="stack-heading" as="h2" class="display-md outline-text" text="Stack" />
        <p class="max-w-xs text-lg text-muted">Languages, frameworks and tools I use day to day. Hover a tile for its name.</p>
      </div>

      <DropGroup as="ul" class="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-7 stage:flex stage:h-full stage:gap-3" role="list">
        <li v-for="(col, ci) in columns" :key="ci" class="contents stage:grid stage:w-[min(9.5rem,10.5vw)] stage:shrink-0 stage:gap-3" :style="{ gridTemplateRows: rows(ci) }">
          <div v-for="(s, si) in col" :key="s.id" class="drop min-h-0" :style="{ '--i': ci * 3 + si, '--r': tilt(ci * 3 + si) }">
            <a :href="s.link" target="_blank" rel="noopener noreferrer" class="pin flex aspect-[4/5] size-full items-center justify-center stage:aspect-auto" :aria-label="s.title">
              <img :src="s.logo" alt="" class="pin-media pin-logo size-[44%] max-w-20 object-contain" />
              <span class="pin-label">{{ s.title }}</span>
            </a>
          </div>
        </li>
      </DropGroup>
    </div>
  </StagePanel>
</template>
