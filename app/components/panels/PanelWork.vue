<script setup lang="ts">
const content = await useContent();
const externalUrl = (link: string) => (/^https?:\/\//.test(link) ? link : `https://${link}`);
</script>

<template>
  <StagePanel id="work" label="Work">
    <div class="flex min-h-full flex-col gap-8">
      <PanelHead id="work" title="Selected work">
        <UButton to="/work" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right" label="All projects" />
      </PanelHead>

      <DropGroup as="ul" class="flex flex-col" role="list">
        <li v-for="(p, i) in content.projects" :key="p.id" class="drop border-t border-default py-8 first:border-t-0 first:pt-0" :style="{ '--i': i }">
          <article class="grid items-center gap-6 lg:gap-10" :class="i % 2 ? 'lg:grid-cols-[1fr_1.25fr]' : 'lg:grid-cols-[1.25fr_1fr]'">
            <a :href="externalUrl(p.link)" target="_blank" rel="noopener noreferrer" class="pin block aspect-[16/9]" :class="{ 'lg:order-2': i % 2 }" :aria-label="`Open ${p.title} (${p.link})`" tabindex="-1">
              <img :src="p.image" :alt="`Screenshot of ${p.title}`" loading="lazy" class="pin-media size-full object-cover object-top" />
            </a>
            <div class="flex flex-col items-start gap-3">
              <div class="flex flex-wrap gap-2">
                <UBadge v-for="t in p.tags" :key="t" :label="t" color="neutral" variant="outline" />
              </div>
              <h3 class="font-display text-3xl font-semibold leading-tight text-highlighted sm:text-4xl">{{ p.title }}</h3>
              <p class="max-w-prose text-lg leading-relaxed text-muted">{{ p.description }}</p>
              <UButton :to="externalUrl(p.link)" target="_blank" rel="noopener noreferrer" color="neutral" variant="link" trailing-icon="i-lucide-arrow-up-right" :label="p.link" class="px-0" />
            </div>
          </article>
        </li>
      </DropGroup>
    </div>
  </StagePanel>
</template>
