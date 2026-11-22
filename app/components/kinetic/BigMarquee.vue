<script setup lang="ts">
// Decorative giant scrolling words. Hidden from assistive tech (the same information is in real text elsewhere).
withDefaults(defineProps<{ words: string[]; duration?: number }>(), { duration: 40 });
</script>

<template>
  <div class="big-marquee" aria-hidden="true">
    <div class="big-marquee-track" :style="{ animationDuration: `${duration}s` }">
      <div v-for="g in 2" :key="g" class="big-marquee-group">
        <span v-for="(w, i) in words" :key="i" class="big-marquee-word" :class="i % 2 ? 'is-fill' : 'is-outline'">{{ w }}</span>
      </div>
    </div>
  </div>
</template>
