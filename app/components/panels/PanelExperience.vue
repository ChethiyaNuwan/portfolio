<script setup lang="ts">
const content = await useContent();
</script>

<template>
  <StagePanel id="experience" label="Experience">
    <div class="flex min-h-full flex-col justify-center gap-8">
      <header class="flex flex-wrap items-end justify-between gap-4">
        <KineticText id="experience-heading" as="h2" class="display-md" text="Experience" />
        <p class="max-w-xs text-lg text-muted">Where I have worked and what I did there.</p>
      </header>
      <ol class="grid items-start gap-5 lg:grid-cols-3">
        <li v-for="e in content.experience" :key="e.id" class="flex flex-col gap-4 border border-default bg-muted/40 p-6">
          <time class="text-sm font-medium text-muted">{{ e.year }}</time>
          <div class="flex items-center gap-3">
            <img :src="e.logo" alt="" class="size-10 shrink-0 border border-default bg-elevated p-1.5 object-contain" />
            <div>
              <h3 class="font-display text-2xl font-semibold leading-tight text-highlighted">{{ e.title }}</h3>
              <p class="text-toned">{{ e.company }}</p>
            </div>
          </div>
          <div v-if="e.labels.length" class="flex flex-wrap gap-2">
            <UBadge v-for="l in e.labels" :key="l" :label="l" color="neutral" variant="outline" />
          </div>
          <p class="text-sm leading-relaxed text-muted">{{ e.description }}</p>
        </li>
      </ol>
    </div>
  </StagePanel>
</template>
