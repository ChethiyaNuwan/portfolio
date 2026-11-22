<script setup lang="ts">
import { jsonLdScript, projectsJsonLd } from "../../server/lib/seo";

const content = await useContent();
const { site } = usePageMeta({
  title: `Work • ${content.value.profile.name}`,
  description: `Projects by ${content.value.profile.name}: ${content.value.projects.map((p) => p.title).join(", ")}.`,
  path: "/work",
});
useHead({ script: [{ type: "application/ld+json", innerHTML: jsonLdScript(projectsJsonLd(content.value, site)) }] });
</script>

<template>
  <section class="py-14 sm:py-20">
    <UContainer>
      <SectionHeader title="Work" description="Projects I designed and built. Open one for screenshots and details." />
      <ProjectGrid />
    </UContainer>
  </section>
</template>
