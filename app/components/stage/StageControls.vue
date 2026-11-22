<script setup lang="ts">
// Hints that the page moves sideways: edge buttons plus a short message until the visitor moves once.
defineProps<{ prev?: { id: string; label: string }; next?: { id: string; label: string }; hinted: boolean }>();
defineEmits<{ go: [dir: 1 | -1] }>();
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-20" aria-hidden="false">
    <button
      v-if="prev"
      type="button"
      class="stage-edge pointer-events-auto left-3"
      :aria-label="`Previous section: ${prev.label}`"
      @click="$emit('go', -1)"
    >
      <UIcon name="i-lucide-arrow-left" class="size-5" />
      <span class="stage-edge-label">{{ prev.label }}</span>
    </button>
    <button
      v-if="next"
      type="button"
      class="stage-edge pointer-events-auto right-3 flex-row-reverse"
      :class="{ 'stage-nudge': !hinted }"
      :aria-label="`Next section: ${next.label}`"
      @click="$emit('go', 1)"
    >
      <UIcon name="i-lucide-arrow-right" class="size-5" />
      <span class="stage-edge-label">{{ next.label }}</span>
    </button>

    <Transition name="hint">
      <p v-if="!hinted" role="note" class="stage-hint pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2">
        <UIcon name="i-lucide-arrow-left" class="size-4" />
        Swipe, use the arrow keys or hold Shift while scrolling to move between sections
        <UIcon name="i-lucide-arrow-right" class="size-4" />
      </p>
    </Transition>
  </div>
</template>
