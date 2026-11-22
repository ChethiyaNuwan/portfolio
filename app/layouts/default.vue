<script setup lang="ts">
import { navItems, socialIconMap } from "~/utils/icons";
import { jsonLdScript, personJsonLd, websiteJsonLd } from "../../server/lib/seo";

const GA_ID = "G-D7QR2BL0BT";
const content = await useContent();
const config = useRuntimeConfig();
const site = ((config.public.siteUrl as string) || useRequestURL().origin).replace(/\/+$/, "");

// Site-wide structured data: who the site is about and what the site is
useHead({
  script: [personJsonLd(content.value, site), websiteJsonLd(content.value, site)].map((o) => ({
    type: "application/ld+json",
    innerHTML: jsonLdScript(o),
  })),
});

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
  <a
    href="#main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-default focus:px-4 focus:py-2 focus:text-highlighted focus:ring-2 focus:ring-primary"
  >
    Skip to content
  </a>
  <UHeader>
    <template #title>
      <span class="font-semibold tracking-tight">{{ content.profile.name }}</span>
    </template>

    <UNavigationMenu :items="navItems" variant="link" aria-label="Primary" />

    <template #right>
      <UColorModeButton />
      <UButton :to="`mailto:${content.profile.email}`" label="Get in touch" icon="i-lucide-mail" class="hidden sm:inline-flex" />
    </template>

    <template #body>
      <UNavigationMenu :items="navItems" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>

  <UMain id="main" tabindex="-1" class="outline-none">
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
