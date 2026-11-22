<script setup lang="ts">
useHead({
  title: "Admin",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});
</script>

<template>
  <div class="min-h-screen bg-darkest-gray text-white">
    <slot />
  </div>
</template>
