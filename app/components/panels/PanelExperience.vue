<script setup lang="ts">
const content = await useContent();
</script>

<template>
  <StagePanel id="experience" label="Experience" wide="max-content">
    <div class="flex h-full flex-col gap-8 stage:flex-row stage:items-stretch stage:gap-14">
      <div class="flex flex-col justify-between gap-4 stage:w-[24vw] stage:shrink-0">
        <KineticText id="experience-heading" as="h2" class="display-md" text="Experience" />
        <p class="max-w-xs text-lg text-muted">Where I have worked and what I did there.</p>
      </div>
      <ol class="grid gap-5 lg:grid-cols-3 stage:grid-cols-none stage:grid-flow-col stage:auto-cols-[min(27rem,30vw)] stage:items-start">
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
          <p class="text-sm leading-relaxed text-muted stage:line-clamp-[12]">{{ e.description }}</p>
        </li>
      </ol>
    </div>
  </StagePanel>
</template>
