<script setup lang="ts">
// Seamless left-scrolling marquee (replacement for react-fast-marquee with autoFill)
withDefaults(defineProps<{ copies?: number; duration?: number }>(), {
  copies: 4,
  duration: 30,
});
</script>

<template>
  <div class="marquee flex w-full overflow-hidden">
    <div
      v-for="group in 2"
      :key="group"
      class="marquee-group flex shrink-0 min-w-full items-center"
      :style="{ animationDuration: `${duration}s` }"
      :aria-hidden="group === 2 || undefined"
    >
      <template v-for="copy in copies" :key="copy">
        <slot />
      </template>
    </div>
  </div>
</template>

<style scoped>
.marquee-group {
  animation: marquee-scroll linear infinite;
}
.marquee:hover .marquee-group {
  animation-play-state: paused;
}
@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}
</style>
