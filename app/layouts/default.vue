<script setup lang="ts">
import { navItems, socialIconMap } from "~/utils/icons";

const GA_ID = "G-D7QR2BL0BT";
const content = await useContent();

// Analytics only on the public site (admin uses its own layout)
useHead({
  script: [
    { src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`, async: true },
    {
      innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
    },
  ],
});
</script>

<template>
  <UHeader>
    <template #title>
      <span class="font-semibold tracking-tight">{{ content.profile.name }}</span>
    </template>

    <UNavigationMenu :items="navItems" variant="link" />

    <template #right>
      <UColorModeButton />
      <UButton :to="`mailto:${content.profile.email}`" label="Get in touch" icon="i-lucide-mail" class="hidden sm:inline-flex" />
    </template>

    <template #body>
      <UNavigationMenu :items="navItems" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>

  <UMain>
    <slot />
  </UMain>

  <USeparator />
  <UFooter>
    <template #left>
      <p class="text-sm text-muted">&copy; {{ new Date().getFullYear() }} {{ content.profile.name }}</p>
    </template>
    <template #right>
      <UButton
        v-for="s in content.socials"
        :key="s.id"
        :to="s.link"
        target="_blank"
        rel="noopener noreferrer"
        :icon="socialIconMap[s.icon]"
        :aria-label="s.title"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
