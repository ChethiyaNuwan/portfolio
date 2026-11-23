<template>
  <StagePanel id="experience" label="Experience">
    <div class="flex min-h-full flex-col gap-8">
      <PanelHead id="experience" title="Experience" outline>
        <p class="max-w-sm text-lg text-muted">Each branch is a role. Its length shows how long it lasted.</p>
      </PanelHead>
      <div class="mx-auto w-full max-w-6xl max-md:flex max-md:min-h-0 max-md:flex-1 max-md:flex-col">
        <ExperienceTree />
      </div>
    </div>
  </StagePanel>
</template>
