<script setup lang="ts">
defineProps<{ title: string; description?: string }>();
</script>

<template>
  <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
    <div class="max-w-2xl">
      <h2 class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">{{ title }}</h2>
      <p v-if="description" class="mt-2 text-lg text-muted">{{ description }}</p>
    </div>
    <slot name="action" />
  </div>
</template>
