<template>
  <StagePanel id="experience" label="Experience">
    <div class="flex min-h-full flex-col gap-8">
      <PanelHead id="experience" title="Experience" outline>
        <p class="max-w-sm text-lg text-muted">Each branch is a role. Its length shows how long it lasted.</p>
      </PanelHead>
      <div class="mx-auto w-full max-w-6xl">
        <ExperienceTree />
      </div>
    </div>
  </StagePanel>
</template>
