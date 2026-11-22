<script setup lang="ts">
const content = await useContent();
const projects = computed(() => content.value.projects);
const externalUrl = (link: string) => (/^https?:\/\//.test(link) ? link : `https://${link}`);

// The slide in focus is full size and upright; its neighbours recede and tilt away.
const carousel = ref<{ emblaApi?: { selectedScrollSnap: () => number; on: (e: string, cb: () => void) => void } }>();
const selected = ref(0);
onMounted(() => {
  const api = carousel.value?.emblaApi;
  if (!api) return;
  selected.value = api.selectedScrollSnap();
  api.on("select", () => (selected.value = api.selectedScrollSnap()));
});
</script>

<template>
  <UCarousel
    ref="carousel"
    v-slot="{ item, index }"
    :items="projects"
    loop
    arrows
    dots
    :autoplay="{ delay: 7000 }"
    aria-label="Selected projects"
    :ui="{
      item: 'basis-[78%] lg:basis-[46%]',
      container: 'gap-0',
      dots: 'mt-5',
      prev: 'start-3 sm:start-3 top-[34%]',
      next: 'end-3 sm:end-3 top-[34%]',
    }"
    class="w-full"
  >
    <article class="project-slide group mr-6 h-full" :class="{ 'is-active': index === selected }" :aria-label="`${item.title}`">
      <div class="aspect-[16/9] overflow-hidden border border-default bg-muted">
        <img :src="item.image" :alt="`Screenshot of ${item.title}`" loading="lazy" class="size-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]" />
      </div>
      <div class="flex flex-col gap-2 pt-4">
        <div class="flex flex-wrap gap-2">
          <UBadge v-for="t in item.tags" :key="t" :label="t" color="neutral" variant="outline" />
        </div>
        <h3 class="font-display text-2xl font-semibold text-highlighted sm:text-3xl">{{ item.title }}</h3>
        <p class="line-clamp-2 text-muted">{{ item.description }}</p>
        <UButton :to="externalUrl(item.link)" target="_blank" rel="noopener noreferrer" color="neutral" variant="link" trailing-icon="i-lucide-arrow-up-right" :label="item.link" class="w-max px-0" />
      </div>
    </article>
  </UCarousel>
</template>
