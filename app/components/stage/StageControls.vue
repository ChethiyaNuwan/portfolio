<script setup lang="ts">
// Slim glass chevron buttons for moving between sections. Hovering one shows where it goes and its key.
// Until the visitor moves once, the right-hand button also shows the two other ways: Shift + mouse wheel, and arrows.
defineProps<{ prev?: { id: string; label: string }; next?: { id: string; label: string }; hinted: boolean }>();
defineEmits<{ go: [dir: 1 | -1] }>();
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-20">
    <div v-if="prev" class="stage-edge-wrap left-3">
      <button type="button" class="stage-edge pointer-events-auto" :aria-label="`Previous section: ${prev.label}`" aria-keyshortcuts="ArrowLeft h [" @click="$emit('go', -1)">
        <UIcon name="i-lucide-chevron-left" class="stage-chevron size-7" />
      </button>
      <span class="stage-tip stage-tip-right" aria-hidden="true">{{ prev.label }}<kbd class="stage-key">H</kbd><kbd class="stage-key">←</kbd></span>
    </div>

    <div v-if="next" class="stage-edge-wrap right-3">
      <button
        type="button"
        class="stage-edge pointer-events-auto"
        :class="{ 'stage-nudge': !hinted }"
        :aria-label="`Next section: ${next.label}`"
        aria-describedby="stage-hint-text"
        aria-keyshortcuts="ArrowRight l ]"
        @click="$emit('go', 1)"
      >
        <UIcon name="i-lucide-chevron-right" class="stage-chevron size-7" />
        <span v-if="!hinted" class="stage-edge-hints" aria-hidden="true">
          <span class="stage-hint-row"><kbd class="stage-key">Shift</kbd><span>+</span><UIcon name="i-lucide-mouse" class="size-4" /></span>
          <span class="stage-hint-row"><kbd class="stage-key">←</kbd><kbd class="stage-key">→</kbd></span>
        </span>
      </button>
      <span class="stage-tip stage-tip-left" aria-hidden="true">{{ next.label }}<kbd class="stage-key">L</kbd><kbd class="stage-key">→</kbd></span>
    </div>

    <span id="stage-hint-text" class="sr-only">
      Move between sections with the left and right arrow keys, H and L, the bracket keys, Alt plus a number, or by holding Shift while scrolling. Press Control or Command plus K to search.
    </span>
  </div>
</template>
