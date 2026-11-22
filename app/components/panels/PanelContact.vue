<script setup lang="ts">
import { socialIconMap } from "~/utils/icons";

const content = await useContent();
const profile = computed(() => content.value.profile);
</script>

<template>
  <StagePanel id="contact" label="Contact">
    <div class="flex min-h-full flex-col justify-center gap-8">
      <KineticText id="contact-heading" as="h2" class="display" text="Let's talk." />
      <address class="not-italic">
        <a :href="`mailto:${profile.email}`" class="font-display text-[clamp(1.5rem,4.2vw,3.75rem)] font-medium text-highlighted underline decoration-primary decoration-2 underline-offset-8 transition-opacity hover:opacity-70">
          {{ profile.email }}
        </a>
        <p v-if="profile.phone || profile.location" class="mt-3 text-lg text-muted">{{ [profile.location, profile.phone].filter(Boolean).join(" · ") }}</p>
      </address>
      <div class="flex flex-wrap items-center gap-2">
        <UButton v-for="s in content.socials" :key="s.id" :to="s.link" target="_blank" rel="noopener noreferrer" :icon="socialIconMap[s.icon]" :label="s.title" color="neutral" variant="outline" />
        <UButton to="/contact" color="neutral" variant="link" label="Common questions" trailing-icon="i-lucide-arrow-right" />
      </div>
    </div>
  </StagePanel>
</template>
