<script setup lang="ts">
const content = await useContent();
const profile = computed(() => content.value.profile);
</script>

<template>
  <section class="py-14 sm:py-20">
    <UContainer class="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
      <div class="hero-in flex flex-col items-start gap-5">
        <UBadge color="success" variant="subtle" size="lg" class="gap-2">
          <span class="relative flex size-2">
            <span class="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
            <span class="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          Available for work
        </UBadge>
        <h1 class="text-5xl font-bold tracking-tight text-highlighted sm:text-6xl">{{ profile.name }}</h1>
        <p class="text-xl font-medium text-toned">{{ profile.title }}</p>
        <p class="max-w-prose text-lg leading-relaxed text-muted">{{ profile.intro }}</p>
        <div class="flex flex-wrap items-center gap-3 pt-2">
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
          <UButton size="xl" color="neutral" variant="link" to="/work" label="See my work" />
        </div>
      </div>

      <div class="relative mx-auto w-full max-w-sm">
        <div class="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl border border-primary/40" aria-hidden="true" />
        <img
          :src="profile.avatar"
          :alt="`Portrait of ${profile.name}`"
          width="480"
          height="600"
          class="relative aspect-[4/5] w-full rounded-3xl object-cover shadow-xl ring-1 ring-default"
        />
      </div>
    </UContainer>
  </section>
</template>
