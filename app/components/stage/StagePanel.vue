<script setup lang="ts">
// One section of the home page. A real <section> with its own heading, always in reading order in the DOM.
defineProps<{ id: string; label: string; wide?: string }>();
</script>

<template>
  <section :id="id" :aria-labelledby="`${id}-heading`" data-stage-panel :data-label="label" class="stage-panel relative" :style="wide ? { '--panel-w': wide } : undefined">
    <slot />
  </section>
</template>
