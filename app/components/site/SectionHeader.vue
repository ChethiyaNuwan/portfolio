<script setup lang="ts">
// Page-level heading for the standalone pages (the single h1 on those pages).
defineProps<{ title: string; description?: string; level?: "h1" | "h2" }>();
</script>

<template>
  <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
    <div class="max-w-3xl">
      <KineticText :as="level ?? 'h1'" class="display-md" :text="title" />
      <p v-if="description" class="mt-4 text-lg text-muted">{{ description }}</p>
    </div>
    <slot name="action" />
  </div>
</template>
