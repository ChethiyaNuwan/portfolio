<script setup lang="ts">
const content = await useContent();
</script>

<template>
  <ol class="divide-y divide-default border-y border-default">
    <li v-for="e in content.experience" :key="e.id" class="grid gap-3 py-7 sm:grid-cols-[11rem_1fr] sm:gap-8">
      <p class="text-sm font-medium text-muted">{{ e.year }}</p>
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <img :src="e.logo" alt="" class="size-10 shrink-0 rounded-lg border border-default bg-elevated p-1.5 object-contain" />
          <div>
            <h3 class="text-lg font-semibold leading-tight text-highlighted">{{ e.title }}</h3>
            <p class="text-toned">{{ e.company }}</p>
          </div>
        </div>
        <div v-if="e.labels.length" class="flex flex-wrap gap-2">
          <UBadge v-for="l in e.labels" :key="l" :label="l" color="neutral" variant="subtle" />
        </div>
        <p class="max-w-prose leading-relaxed text-muted">{{ e.description }}</p>
      </div>
    </li>
  </ol>
</template>
