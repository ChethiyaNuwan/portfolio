<script setup lang="ts">
import { socialIconMap } from "~/utils/icons";
import { faqJsonLd } from "../../server/lib/seo";

const content = await useContent();
const profile = computed(() => content.value.profile);
const faq = computed(() => content.value.faq.map((f) => ({ label: f.question, content: f.answer })));

usePageMeta({
  title: `Contact • ${content.value.profile.name}`,
  description: "Get in touch about a project, a role, or just to say hello.",
  path: "/contact",
  jsonLd: [faqJsonLd(content.value)],
});
</script>

<template>
  <section class="py-14 sm:py-20">
    <UContainer class="max-w-4xl">
      <SectionHeader title="Contact" description="Tell me about your project or role and I will get back to you." />

      <div class="grid gap-6 border border-default bg-muted/40 p-8 sm:grid-cols-[1fr_auto] sm:items-center sm:p-10">
        <div class="space-y-2">
          <p class="text-sm text-muted">Email</p>
          <a :href="`mailto:${profile.email}`" class="break-all text-2xl font-semibold text-highlighted underline-offset-4 hover:underline">{{ profile.email }}</a>
          <p v-if="profile.phone || profile.location" class="text-muted">
            {{ [profile.location, profile.phone].filter(Boolean).join(" · ") }}
          </p>
          <div class="flex gap-1 pt-2">
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
          </div>
        </div>
        <UButton size="xl" :href="`mailto:${profile.email}`" icon="i-lucide-mail" label="Email me" />
      </div>

      <div v-if="faq.length" class="mt-16">
        <SectionHeader title="Common questions" />
        <UAccordion :items="faq" type="multiple" />
      </div>
    </UContainer>
  </section>
</template>
