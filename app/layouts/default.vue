<script setup lang="ts">
import { jsonLdScript, personJsonLd, websiteJsonLd } from "../../server/lib/seo";

const GA_ID = "G-D7QR2BL0BT";
const content = await useContent();
const config = useRuntimeConfig();
const site = ((config.public.siteUrl as string) || useRequestURL().origin).replace(/\/+$/, "");

// Site-wide structured data (who the site is about, and what the site is) + analytics on the public site only
useHead({
  script: [personJsonLd(content.value, site), websiteJsonLd(content.value, site)].map((o) => ({
    type: "application/ld+json",
    innerHTML: jsonLdScript(o),
  })),
});
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

  <UMain id="main" tabindex="-1" class="min-h-0 pb-[var(--footer-space)] outline-none">
    <slot />
  </UMain>

  <SiteFooter />
  <SectionPalette />
</template>
