<script setup lang="ts">
const content = await useContent();
const items = computed(() => content.value.gallery.slice(0, 8));

// Pairs of images per column; alternating row proportions give the uneven, Pinterest-like rhythm.
const columns = computed(() => {
  const cols: (typeof items.value)[] = [];
  for (let i = 0; i < items.value.length; i += 2) cols.push(items.value.slice(i, i + 2));
  return cols;
});
const rows = (ci: number) => (ci % 2 ? "2fr 3fr" : "3fr 2fr");
const tilt = (i: number) => `${((i * 53) % 7) - 3}deg`;
</script>

<template>
  <StagePanel v-if="items.length" id="gallery" label="Gallery" wide="max-content">
    <div class="flex h-full flex-col gap-8 stage:flex-row stage:gap-10">
      <div class="flex flex-col justify-between gap-4 stage:w-[24vw] stage:shrink-0">
        <KineticText id="gallery-heading" as="h2" class="display-md outline-text" text="Gallery" />
        <div class="flex flex-col items-start gap-4">
          <p class="max-w-xs text-lg text-muted">Interfaces and designs from the projects. Open the gallery to filter and enlarge.</p>
          <UButton to="/gallery" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right" label="Open gallery" />
        </div>
      </div>
      <DropGroup as="ul" class="grid grid-cols-2 gap-4 lg:grid-cols-4 stage:flex stage:h-full stage:gap-4">
        <li v-for="(col, ci) in columns" :key="ci" class="contents stage:grid stage:w-[min(21rem,22vw)] stage:shrink-0 stage:gap-4" :style="{ gridTemplateRows: rows(ci) }">
          <div v-for="(g, gi) in col" :key="g.id" class="drop min-h-0" :style="{ '--i': ci * 2 + gi, '--r': tilt(ci * 2 + gi) }">
            <figure class="m-0 size-full">
              <NuxtLink to="/gallery" class="pin block aspect-[4/3] size-full stage:aspect-auto" :aria-label="g.caption ? `Open gallery: ${g.caption}` : 'Open gallery'">
                <img :src="g.image" :alt="g.caption" loading="lazy" class="pin-media size-full object-cover" />
                <figcaption v-if="g.caption" class="pin-label">{{ g.caption }}</figcaption>
              </NuxtLink>
            </figure>
          </div>
        </li>
      </DropGroup>
    </div>
  </StagePanel>
</template>
