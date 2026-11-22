<script setup lang="ts">
const isLoaded = ref(false);
onMounted(() => {
  isLoaded.value = true;
});
</script>

<template>
  <div class="absolute inset-0 grid grid-rows-[repeat(10,auto)] grid-cols-[repeat(10,1fr)]">
    <Motion
      v-for="index in 100"
      :key="index"
      class="bg-image-bg rounded-lg"
      :initial="{ opacity: 1 }"
      :animate="{ opacity: isLoaded ? 0 : 1 }"
      :transition="{ duration: 0.5, delay: Math.random() * 0.5, ease: 'easeInOut' }"
    />
  </div>
</template>
