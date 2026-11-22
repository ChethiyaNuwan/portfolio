<script setup lang="ts">
const content = await useContent();
const items = computed(() => content.value.gallery.slice(0, 16));
const tilt = (i: number) => `${((i * 53) % 7) - 3}deg`;
</script>

<template>
  <StagePanel v-if="items.length" id="gallery" label="Gallery">
    <div class="flex min-h-full flex-col gap-8">
      <header class="flex flex-wrap items-end justify-between gap-4">
        <KineticText id="gallery-heading" as="h2" class="display-md outline-text" text="Gallery" />
        <div class="flex flex-wrap items-center gap-4">
          <p class="max-w-xs text-lg text-muted">Interfaces and designs from the projects.</p>
          <UButton to="/gallery" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right" label="Open gallery" />
        </div>
      </header>
      <DropGroup as="ul" class="columns-2 gap-4 lg:columns-3" role="list">
        <li v-for="(g, i) in items" :key="g.id" class="drop mb-4 break-inside-avoid" :style="{ '--i': i % 12, '--r': tilt(i) }">
          <NuxtLink to="/gallery" class="pin block" :aria-label="g.caption ? `Open gallery: ${g.caption}` : 'Open gallery'">
            <img :src="g.image" :alt="g.caption" loading="lazy" class="pin-media block h-auto w-full" />
            <span v-if="g.caption" class="pin-label">{{ g.caption }}</span>
          </NuxtLink>
        </li>
      </DropGroup>
    </div>
  </StagePanel>
</template>
