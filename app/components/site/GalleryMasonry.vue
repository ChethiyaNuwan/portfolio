<script setup lang="ts">
const props = defineProps<{ limit?: number; filterable?: boolean }>();
const content = await useContent();

const activeTag = ref<string | null>(null);
const tags = computed(() => [...new Set(content.value.gallery.flatMap((g) => g.tags))]);
const items = computed(() => {
  const all = content.value.gallery.filter((g) => !activeTag.value || g.tags.includes(activeTag.value));
  return props.limit ? all.slice(0, props.limit) : all;
});

const viewer = ref<{ open: (i: number, el?: HTMLElement | null) => void }>();
</script>

<template>
  <div>
    <div v-if="filterable && tags.length" class="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
      <UButton label="All" size="sm" :color="activeTag === null ? 'primary' : 'neutral'" :variant="activeTag === null ? 'solid' : 'outline'" @click="activeTag = null" />
      <UButton
        v-for="t in tags"
        :key="t"
        :label="t"
        size="sm"
        :color="activeTag === t ? 'primary' : 'neutral'"
        :variant="activeTag === t ? 'solid' : 'outline'"
        @click="activeTag = t"
      />
    </div>
    <p class="sr-only" aria-live="polite">{{ items.length }} images shown</p>

    <p v-if="!items.length" class="border border-dashed border-default p-10 text-center text-muted">No images yet. Add some from the admin under Gallery.</p>

    <DropGroup v-else as="ul" class="columns-1 gap-4 sm:columns-2 lg:columns-3" role="list" :aria-label="`${items.length} gallery images`">
      <li v-for="(g, i) in items" :key="g.id" class="drop mb-4 break-inside-avoid" :style="{ '--i': i % 9, '--r': `${((i * 53) % 7) - 3}deg` }">
        <button type="button" class="pin block w-full cursor-zoom-in" :data-gallery-id="g.id" :aria-label="g.caption ? `Expand image: ${g.caption}` : 'Expand image'" @click="viewer?.open(i, $event.currentTarget as HTMLElement)">
          <img :src="g.image" :alt="g.caption" loading="lazy" class="pin-media block h-auto w-full" />
          <span v-if="g.caption" class="pin-label text-left">{{ g.caption }}</span>
        </button>
      </li>
    </DropGroup>

    <GalleryViewer ref="viewer" :items="items" />
  </div>
</template>
