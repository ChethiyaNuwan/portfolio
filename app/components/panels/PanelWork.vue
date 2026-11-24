<script setup lang="ts">
const content = await useContent();
// While the project spotlight is up, the rest of the section dims with the other cards.
const spotlit = ref(false);
</script>

<template>
  <StagePanel id="work" label="Projects">
    <div class="flex min-h-full flex-col gap-8" :class="{ spotlit }">
      <PanelHead id="work" title="Projects">
        <p class="max-w-sm text-lg text-muted">Everything I have built and designed. Open a project for its screenshots, details and live link.</p>
      </PanelHead>
      <ProjectGrid @spot="spotlit = $event" />

      <template v-if="content.gallery.length">
        <h3 class="proj-dimmable font-display text-2xl font-semibold text-highlighted">Gallery</h3>
        <GalleryMasonry class="proj-dimmable" filterable />
      </template>
    </div>
  </StagePanel>
</template>
