<script setup lang="ts">
useSeoMeta({
  title: "Gallery • Chethiya Nuwan",
  description: "Interfaces and designs from my projects.",
});
</script>

<template>
  <section class="py-14 sm:py-20">
    <UContainer>
      <SectionHeader title="Gallery" description="Interfaces and designs from my projects. Select an image to enlarge it." />
      <GalleryMasonry filterable />
    </UContainer>
  </section>
</template>
