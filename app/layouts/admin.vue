<script setup lang="ts">
useHead({
  title: "Admin",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});
</script>

<template>
  <div class="min-h-screen bg-default text-highlighted">
    <slot />
  </div>
</template>
