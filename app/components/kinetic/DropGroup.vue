<script setup lang="ts">
// Wrapper that starts the Pinterest-style staggered "drop in" of its .drop children when it scrolls into view.
defineProps<{ as?: string }>();
const el = ref<HTMLElement>();
const inView = useInView(el, { threshold: 0.12 });
</script>

<template>
  <component :is="as ?? 'div'" ref="el" :class="{ 'is-in': inView }">
    <slot />
  </component>
</template>
