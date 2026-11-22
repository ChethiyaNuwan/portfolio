<script setup lang="ts">
const show = ref(true);

onMounted(() => {
  document.fonts.ready.then(() => {
    show.value = false;
  });
});
</script>

<template>
  <AnimatePresence>
    <Motion
      v-if="show"
      key="splash"
      :initial="{ opacity: 1 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0.6, y: -800 }"
      :transition="{ duration: 0.5 }"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-inherit"
    >
      <div class="text-center">
        <div class="mb-4 text-4xl font-bold tracking-tight text-white animate-pulse">W E L C O M E</div>
        <div class="w-40 h-1 mx-auto bg-gray-700 rounded-full">
          <div class="h-full bg-current rounded-full animate-ping" />
        </div>
      </div>
    </Motion>
  </AnimatePresence>
</template>
