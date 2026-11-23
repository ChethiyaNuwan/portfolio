<script setup lang="ts">
const content = await useContent();
const items = computed(() => content.value.gallery.slice(0, 16));
const viewer = ref<{ open: (i: number, el?: HTMLElement | null) => void }>();
const tilt = (i: number) => `${((i * 53) % 7) - 3}deg`;
</script>

<template>
  <StagePanel v-if="items.length" id="gallery" label="Gallery">
    <div class="flex min-h-full flex-col gap-8">
      <PanelHead id="gallery" title="Gallery">
        <p class="max-w-xs text-lg text-muted">Click an image to expand it.</p>
        <UButton to="/gallery" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right" label="Open gallery" class="tap" />
      </PanelHead>
      <DropGroup as="ul" class="columns-2 gap-4 md:columns-3" role="list">
        <li v-for="(g, i) in items" :key="g.id" class="drop mb-4 break-inside-avoid" :style="{ '--i': i % 12, '--r': tilt(i) }">
          <button type="button" class="pin block w-full cursor-zoom-in" :data-gallery-id="g.id" :aria-label="g.caption ? `Expand image: ${g.caption}` : 'Expand image'" @click="viewer?.open(i, $event.currentTarget as HTMLElement)">
            <img :src="g.image" :alt="g.caption" loading="lazy" class="pin-media block h-auto w-full" />
            <span v-if="g.caption" class="pin-label text-left">{{ g.caption }}</span>
          </button>
        </li>
      </DropGroup>
    </div>
    <GalleryViewer ref="viewer" :items="items" />
  </StagePanel>
</template>
