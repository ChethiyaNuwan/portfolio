<script setup lang="ts">
const label = useSectionLabel("work", "Projects");
// While a project is out, the heading dims along with the other cards.
const spotlit = ref(false);
</script>

<template>
  <StagePanel id="work" :label="label">
    <div class="flex min-h-full flex-col gap-8" :class="{ spotlit }">
      <PanelHead id="work" :title="label">
        <p class="max-w-sm text-lg text-muted">Everything I have built. Hover a project to stop the show, open one for its details and live link.</p>
      </PanelHead>
      <ProjectGrid @spot="spotlit = $event" />
    </div>
  </StagePanel>
</template>
