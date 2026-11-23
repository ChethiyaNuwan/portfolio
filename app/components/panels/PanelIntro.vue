<script setup lang="ts">
const content = await useContent();
const profile = computed(() => content.value.profile);
const marqueeWords = computed(() => [profile.value.title, ...content.value.services.map((s) => s.title)].filter(Boolean));
</script>

<template>
  <StagePanel id="intro" label="Intro" fit class="overflow-hidden">
    <figure class="hero-portrait">
      <img :src="profile.avatar" :alt="`Portrait of ${profile.name}`" width="960" height="1200" fetchpriority="high" />
    </figure>

    <div class="relative z-10 flex min-h-full flex-col justify-between gap-5">
      <div class="flex flex-1 items-center">
        <div class="flex max-w-3xl flex-col items-start gap-5">
          <UBadge color="success" variant="outline" size="lg" class="gap-2 bg-default/60 backdrop-blur-sm">
            <span class="relative flex size-2">
              <span class="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
              <span class="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            Available for work
          </UBadge>
          <KineticText id="intro-heading" as="h1" class="display max-w-[11ch]" :text="profile.name" />
          <p class="font-display text-2xl text-toned sm:text-3xl">{{ profile.title }}</p>
          <p class="hero-intro max-w-xl text-lg leading-relaxed text-muted">{{ profile.intro }}</p>
          <div class="flex flex-wrap items-center gap-3">
            <UButton size="xl" :href="`mailto:${profile.email}`" icon="i-lucide-mail" label="Contact me" />
            <UButton
              size="xl"
              color="neutral"
              variant="outline"
              href="/cv"
              target="_blank"
              :download="`${profile.name.replace(/\s+/g, '_')}_Resume.pdf`"
              icon="i-lucide-file-text"
              label="Download CV"
              class="bg-default/60 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      <dl class="hero-stats grid grid-cols-2 gap-x-6 gap-y-2 pt-5 sm:flex sm:flex-wrap sm:gap-x-10 sm:gap-y-3">
        <div v-for="c in content.counters" :key="c.id" class="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
          <dd class="font-display text-3xl font-semibold text-highlighted"><CountUp :end="c.value" />+</dd>
          <dt class="text-sm text-muted">{{ c.title }}</dt>
        </div>
      </dl>

      <BigMarquee class="hero-marquee" :words="marqueeWords" />
    </div>
  </StagePanel>
</template>
