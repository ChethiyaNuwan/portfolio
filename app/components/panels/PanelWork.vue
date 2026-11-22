<template>
  <StagePanel id="work" label="Work">
    <div class="flex min-h-full flex-col gap-6">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <KineticText id="work-heading" as="h2" class="display-md" text="Selected work" />
        <UButton to="/work" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right" label="All projects" />
      </div>
      <div class="flex min-h-0 flex-1 items-center">
        <ProjectCarousel />
      </div>
    </div>
  </StagePanel>
</template>
