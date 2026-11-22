<script setup lang="ts">
const content = await useContent();
const profile = computed(() => content.value.profile);
const marqueeWords = computed(() => [profile.value.title, ...content.value.services.map((s) => s.title)].filter(Boolean));
</script>

<template>
  <StagePanel id="intro" label="Intro">
    <div class="flex h-full flex-col justify-between gap-8">
      <div class="grid flex-1 items-center gap-10 lg:grid-cols-[1fr_auto]">
        <div class="flex flex-col items-start gap-6">
          <UBadge color="success" variant="outline" size="lg" class="gap-2">
            <span class="relative flex size-2">
              <span class="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
              <span class="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            Available for work
          </UBadge>
          <KineticText id="intro-heading" as="h1" class="display max-w-[11ch]" :text="profile.name" />
          <p class="font-display text-2xl text-toned sm:text-3xl">{{ profile.title }}</p>
          <p class="max-w-xl text-lg leading-relaxed text-muted">{{ profile.intro }}</p>
          <div class="flex flex-wrap items-center gap-3">
            <UButton size="xl" :href="`mailto:${profile.email}`" icon="i-lucide-mail" label="Email me" />
            <UButton
              size="xl"
              color="neutral"
              variant="outline"
              href="/cv"
              target="_blank"
              :download="`${profile.name.replace(/\s+/g, '_')}_Resume.pdf`"
              icon="i-lucide-file-text"
              label="Download CV"
            />
          </div>
        </div>

        <figure class="relative mx-auto hidden w-[min(24vw,20rem)] lg:block">
          <div class="absolute inset-0 translate-x-3 translate-y-3 border border-primary" aria-hidden="true" />
          <img :src="profile.avatar" :alt="`Portrait of ${profile.name}`" width="480" height="640" class="relative aspect-[3/4] w-full object-cover grayscale contrast-110 transition-[filter] duration-700 hover:grayscale-0" />
        </figure>
      </div>

      <dl class="flex flex-wrap gap-x-10 gap-y-3 border-t border-default pt-5">
        <div v-for="c in content.counters" :key="c.id" class="flex items-baseline gap-2">
          <dd class="font-display text-3xl font-semibold text-highlighted"><CountUp :end="c.value" />+</dd>
          <dt class="text-sm text-muted">{{ c.title }}</dt>
        </div>
      </dl>

      <BigMarquee :words="marqueeWords" />
    </div>
  </StagePanel>
</template>
