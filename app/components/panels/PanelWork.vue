<script setup lang="ts">
const content = await useContent();
const externalUrl = (link: string) => (/^https?:\/\//.test(link) ? link : `https://${link}`);
</script>

<template>
  <StagePanel id="work" label="Work">
    <div class="flex min-h-full flex-col gap-8">
      <PanelHead id="work" title="Selected work">
        <UButton to="/work" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right" label="All projects" class="tap" />
      </PanelHead>

      <DropGroup as="ul" class="m-hscroll m-center flex flex-col" role="list">
        <li v-for="(p, i) in content.projects" :key="p.id" class="drop border-t border-default py-8 first:border-t-0 first:pt-0 max-md:border max-md:p-3 max-md:first:pt-3" :style="{ '--i': i }">
          <article class="grid items-center gap-6 md:gap-10" :class="i % 2 ? 'md:grid-cols-[1fr_1.25fr]' : 'md:grid-cols-[1.25fr_1fr]'">
            <a :href="externalUrl(p.link)" target="_blank" rel="noopener noreferrer" class="pin block aspect-[16/9]" :class="{ 'md:order-2': i % 2 }" :aria-label="`Open ${p.title} (${p.link})`" tabindex="-1">
              <img :src="p.image" :alt="`Screenshot of ${p.title}`" loading="lazy" class="pin-media size-full object-cover object-top" />
            </a>
            <div class="flex flex-col items-start gap-3">
              <div class="flex flex-wrap gap-2">
                <UBadge v-for="t in p.tags" :key="t" :label="t" color="neutral" variant="outline" />
              </div>
              <h3 class="font-display text-3xl font-semibold leading-tight text-highlighted sm:text-4xl">{{ p.title }}</h3>
              <p class="max-w-prose text-lg leading-relaxed text-muted max-md:line-clamp-4 max-md:text-base">{{ p.description }}</p>
              <UButton :to="externalUrl(p.link)" target="_blank" rel="noopener noreferrer" color="neutral" variant="link" trailing-icon="i-lucide-arrow-up-right" :label="p.link" class="tap px-0" />
            </div>
          </article>
        </li>
      </DropGroup>
    </div>
  </StagePanel>
</template>
