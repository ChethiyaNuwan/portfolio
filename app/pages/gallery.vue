<script setup lang="ts">
import { galleryJsonLd, jsonLdScript } from "../../server/lib/seo";

const content = await useContent();
const { site } = usePageMeta({
  title: `Gallery • ${content.value.profile.name}`,
  description: "Interfaces and designs from my projects, filterable by tag.",
  path: "/gallery",
});
useHead({ script: [{ type: "application/ld+json", innerHTML: jsonLdScript(galleryJsonLd(content.value, site)) }] });
</script>

<template>
  <section class="py-14 sm:py-20">
    <UContainer>
      <SectionHeader title="Gallery" description="Interfaces and designs from my projects. Select an image to enlarge it." />
      <GalleryMasonry filterable />
    </UContainer>
  </section>
</template>
