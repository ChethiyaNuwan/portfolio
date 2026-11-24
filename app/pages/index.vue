<script setup lang="ts">
import type { Component } from "vue";
import { jsonLdScript, projectsJsonLd } from "../../server/lib/seo";

const content = await useContent();

// the sections, in the order and with the visibility set in the admin (Sections)
const panelComponents: Record<string, Component> = {
  intro: resolveComponent("PanelIntro") as Component,
  work: resolveComponent("PanelWork") as Component,
  experience: resolveComponent("PanelExperience") as Component,
  stack: resolveComponent("PanelStack") as Component,
  services: resolveComponent("PanelServices") as Component,
  contact: resolveComponent("PanelContact") as Component,
};
const shown = computed(() => content.value.sections.filter((s) => s.visible && panelComponents[s.id]));

const { site } = usePageMeta({
  title: `${content.value.profile.name} • ${content.value.profile.title}`,
  description: content.value.profile.intro.slice(0, 160),
  path: "/",
});
useHead({ script: [{ type: "application/ld+json", innerHTML: jsonLdScript(projectsJsonLd(content.value, site)) }] });
</script>

<template>
  <HorizontalStage>
    <component :is="panelComponents[s.id]" v-for="s in shown" :key="s.id" />
  </HorizontalStage>
</template>
