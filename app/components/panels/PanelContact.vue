<script setup lang="ts">
const label = useSectionLabel("contact", "Contact");
import { socialIconMap } from "~/utils/icons";

const content = await useContent();
const profile = computed(() => content.value.profile);
</script>

<template>
  <StagePanel id="contact" :label="label">
    <div class="grid min-h-full grid-cols-[minmax(0,1fr)] content-start items-start gap-5 md:gap-8 lg:grid-cols-[1fr_1fr] lg:content-normal lg:items-center lg:gap-16">
      <div class="flex flex-col justify-center gap-5 md:gap-8">
        <KineticText id="contact-heading" as="h2" class="display" text="Let's talk." />
        <address class="not-italic">
          <a :href="`mailto:${profile.email}`" class="inline-block break-all py-2 font-display text-[clamp(1.4rem,3.4vw,3rem)] font-medium text-highlighted underline decoration-primary decoration-2 underline-offset-8 transition-opacity hover:opacity-70">
            {{ profile.email }}
          </a>
          <p v-if="profile.phone" class="mt-3 text-lg text-muted"><a :href="`tel:${profile.phone.replace(/[^\d+]/g, '')}`" class="py-1 underline decoration-primary/50 underline-offset-4 hover:text-highlighted">{{ profile.phone }}</a></p>
          <p v-if="profile.location" class="text-lg text-muted" :class="{ 'mt-3': !profile.phone }">{{ profile.location }}</p>
        </address>
        <div class="flex flex-wrap items-center gap-2">
          <UButton v-for="s in content.socials" :key="s.id" :to="s.link" target="_blank" rel="noopener noreferrer" :icon="socialIconMap[s.icon]" :label="s.title" color="neutral" variant="outline" class="tap" />
        </div>
      </div>

      <TypedFaq v-if="content.faq.length" :items="content.faq" />
    </div>
  </StagePanel>
</template>
