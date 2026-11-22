<script setup lang="ts">
defineProps<{ limit?: number }>();
const content = await useContent();
const projects = computed(() => content.value.projects);
const externalUrl = (link: string) => (/^https?:\/\//.test(link) ? link : `https://${link}`);
</script>

<template>
  <UCarousel
    v-slot="{ item }"
    :items="limit ? projects.slice(0, limit) : projects"
    loop
    arrows
    dots
    :autoplay="{ delay: 6000 }"
    :ui="{
      item: 'basis-[88%] md:basis-[62%] lg:basis-[48%]',
      container: 'gap-0',
      dots: 'mt-6',
      prev: 'start-3 sm:start-3 top-[34%]',
      next: 'end-3 sm:end-3 top-[34%]',
    }"
    class="w-full"
  >
    <article class="group mr-5 h-full overflow-hidden rounded-2xl border border-default bg-elevated/40">
      <div class="aspect-[16/10] overflow-hidden bg-muted">
        <img
          :src="item.image"
          :alt="`Screenshot of ${item.title}`"
          loading="lazy"
          class="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <div class="flex flex-col gap-3 p-5">
        <div class="flex flex-wrap gap-2">
          <UBadge v-for="t in item.tags" :key="t" :label="t" color="neutral" variant="subtle" />
        </div>
        <h3 class="text-xl font-semibold text-highlighted">{{ item.title }}</h3>
        <p class="line-clamp-2 text-muted">{{ item.description }}</p>
        <div>
          <UButton
            :to="externalUrl(item.link)"
            target="_blank"
            rel="noopener noreferrer"
            color="neutral"
            variant="link"
            trailing-icon="i-lucide-arrow-up-right"
            :label="item.link"
            class="px-0"
          />
        </div>
      </div>
    </article>
  </UCarousel>
</template>
