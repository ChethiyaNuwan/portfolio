<script setup lang="ts">
import { jsonLdScript, projectsJsonLd } from "../../server/lib/seo";

const content = await useContent();

const { site } = usePageMeta({
  title: `${content.value.profile.name} • ${content.value.profile.title}`,
  description: content.value.profile.intro.slice(0, 160),
  path: "/",
});
useHead({ script: [{ type: "application/ld+json", innerHTML: jsonLdScript(projectsJsonLd(content.value, site)) }] });
</script>

<template>
  <HorizontalStage>
    <PanelIntro />
    <PanelWork />
    <PanelExperience />
    <PanelStack />
    <PanelServices />
    <PanelGallery />
    <PanelContact />
  </HorizontalStage>
</template>
