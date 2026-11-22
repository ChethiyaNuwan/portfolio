<script setup lang="ts">
const props = defineProps<{ limit?: number; filterable?: boolean }>();
const content = await useContent();

const activeTag = ref<string | null>(null);
const tags = computed(() => [...new Set(content.value.gallery.flatMap((g) => g.tags))]);
const items = computed(() => {
  const all = content.value.gallery.filter((g) => !activeTag.value || g.tags.includes(activeTag.value));
  return props.limit ? all.slice(0, props.limit) : all;
});

const openIndex = ref<number | null>(null);
const isOpen = computed({
  get: () => openIndex.value !== null,
  set: (v: boolean) => {
    if (!v) openIndex.value = null;
  },
});
const current = computed(() => (openIndex.value === null ? null : items.value[openIndex.value] ?? null));

const step = (d: 1 | -1) => {
  if (openIndex.value === null || !items.value.length) return;
  openIndex.value = (openIndex.value + d + items.value.length) % items.value.length;
};

function onKey(e: KeyboardEvent) {
  if (!isOpen.value) return;
  if (e.key === "ArrowRight") step(1);
  if (e.key === "ArrowLeft") step(-1);
}
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<template>
  <div>
    <div v-if="filterable && tags.length" class="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
      <UButton
        label="All"
        size="sm"
        :color="activeTag === null ? 'primary' : 'neutral'"
        :variant="activeTag === null ? 'solid' : 'outline'"
        @click="activeTag = null"
      />
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

    <p v-if="!items.length" class="border border-dashed border-default p-10 text-center text-muted">
      No images yet. Add some from the admin under Gallery.
    </p>

    <DropGroup v-else as="ul" class="columns-1 gap-4 sm:columns-2 lg:columns-3" role="list" :aria-label="`${items.length} gallery images`">
      <li v-for="(g, i) in items" :key="g.id" class="drop mb-4 break-inside-avoid" :style="{ '--i': i % 9, '--r': `${((i * 53) % 7) - 3}deg` }">
        <button type="button" class="pin block w-full cursor-zoom-in" :aria-label="g.caption ? `Open image: ${g.caption}` : 'Open image'" @click="openIndex = i">
          <img :src="g.image" :alt="g.caption" loading="lazy" class="pin-media block h-auto w-full" />
          <span v-if="g.caption" class="pin-label text-left">{{ g.caption }}</span>
        </button>
      </li>
    </DropGroup>

    <UModal v-model:open="isOpen" :title="current?.caption || 'Image'" description="Use the arrow keys or buttons to browse." :ui="{ content: 'max-w-4xl' }">
      <template #body>
        <div v-if="current" class="relative">
          <img :src="current.image" :alt="current.caption" class="mx-auto max-h-[70vh] w-auto max-w-full rounded-lg object-contain" />
          <template v-if="items.length > 1">
            <UButton class="absolute left-2 top-1/2 -translate-y-1/2" icon="i-lucide-chevron-left" color="neutral" variant="solid" aria-label="Previous image" @click="step(-1)" />
            <UButton class="absolute right-2 top-1/2 -translate-y-1/2" icon="i-lucide-chevron-right" color="neutral" variant="solid" aria-label="Next image" @click="step(1)" />
          </template>
          <div v-if="current.tags.length" class="mt-4 flex flex-wrap gap-2">
            <UBadge v-for="t in current.tags" :key="t" :label="t" color="neutral" variant="subtle" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
