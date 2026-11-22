<script setup lang="ts">
// Section change controls: a soft fade at each screen edge with a chevron, no boxes. Hovering one shows where it goes.
// Until the visitor moves once, the right chevron gently nudges. (Keyboard shortcuts are described for screen readers
// below and are listed in the command palette; they are not shown on these buttons.)
defineProps<{ prev?: { id: string; label: string }; next?: { id: string; label: string }; hinted: boolean }>();
defineEmits<{ go: [dir: 1 | -1] }>();
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-20">
    <button v-if="prev" type="button" class="stage-edge stage-edge-left" :aria-label="`Previous section: ${prev.label}`" aria-keyshortcuts="ArrowLeft h [" @click="$emit('go', -1)">
      <UIcon name="i-lucide-chevron-left" class="stage-chevron size-9" />
      <span class="stage-tip" aria-hidden="true">{{ prev.label }}</span>
    </button>

    <button
      v-if="next"
      type="button"
      class="stage-edge stage-edge-right"
      :class="{ 'stage-nudge': !hinted }"
      :aria-label="`Next section: ${next.label}`"
      aria-describedby="stage-hint-text"
      aria-keyshortcuts="ArrowRight l ]"
      @click="$emit('go', 1)"
    >
      <UIcon name="i-lucide-chevron-right" class="stage-chevron size-9" />
      <span class="stage-tip" aria-hidden="true">{{ next.label }}</span>
    </button>

    <span id="stage-hint-text" class="sr-only">
      Move between sections with the left and right arrow keys, H and L, the bracket keys, Alt plus a number, or by holding Shift while scrolling. Press Control or Command plus K to search.
    </span>
  </div>
</template>
