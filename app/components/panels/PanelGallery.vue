<script setup lang="ts">
const content = await useContent();
</script>

<template>
  <StagePanel v-if="content.gallery.length" id="gallery" label="Gallery">
    <div class="flex min-h-full flex-col gap-8">
      <PanelHead id="gallery" title="Gallery">
        <p class="max-w-sm text-lg text-muted">Every image. Filter by tag, select one to enlarge it.</p>
      </PanelHead>
      <GalleryMasonry filterable />
    </div>
  </StagePanel>
</template>
