<script setup lang="ts">
// Edge buttons for moving between sections. Until the visitor moves once, the right-hand button also shows small
// icons for the ways to do it: swipe, arrow keys, Shift + scroll, mouse.
defineProps<{ prev?: { id: string; label: string }; next?: { id: string; label: string }; hinted: boolean }>();
defineEmits<{ go: [dir: 1 | -1] }>();
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-20">
    <button v-if="prev" type="button" class="stage-edge pointer-events-auto left-3" :aria-label="`Previous section: ${prev.label}`" @click="$emit('go', -1)">
      <span class="stage-edge-row">
        <UIcon name="i-lucide-arrow-left" class="size-5" />
        <span class="stage-edge-label">{{ prev.label }}</span>
      </span>
    </button>

    <button
      v-if="next"
      type="button"
      class="stage-edge pointer-events-auto right-3"
      :class="{ 'stage-nudge': !hinted }"
      :aria-label="`Next section: ${next.label}`"
      aria-describedby="stage-hint-text"
      @click="$emit('go', 1)"
    >
      <span class="stage-edge-row flex-row-reverse">
        <UIcon name="i-lucide-arrow-right" class="size-5" />
        <span class="stage-edge-label">{{ next.label }}</span>
      </span>
      <span v-if="!hinted" class="stage-edge-hints" aria-hidden="true">
        <UIcon name="i-lucide-hand" class="size-4" />
        <UIcon name="i-lucide-keyboard" class="size-4" />
        <UIcon name="i-lucide-arrow-big-up" class="size-4" />
        <UIcon name="i-lucide-mouse" class="size-4" />
      </span>
    </button>
    <span id="stage-hint-text" class="sr-only">Swipe, use the left and right arrow keys, or hold Shift while scrolling to move between sections.</span>
  </div>
</template>
