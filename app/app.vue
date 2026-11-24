<script setup lang="ts">
// The accent colour is set in the admin (Appearance), separately for dark and light mode.
const content = await useContent();
useHead({
  style: [
    {
      key: "accent",
      innerHTML: `html:root:not(.dark){--ui-primary:${content.value.theme.accentLight}}html.dark{--ui-primary:${content.value.theme.accentDark}}`,
    },
  ],
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
