<script setup lang="ts">
const label = useSectionLabel("experience", "Experience");
</script>

<template>
  <StagePanel id="experience" :label="label">
    <div class="flex min-h-full flex-col gap-8">
      <PanelHead id="experience" :title="label" outline>
        <p class="max-w-sm text-lg text-muted">Each branch is a role. Its length shows how long it lasted.</p>
      </PanelHead>
      <div class="mx-auto w-full max-w-6xl">
        <ExperienceTree />
        <EducationList />
      </div>
    </div>
  </StagePanel>
</template>
