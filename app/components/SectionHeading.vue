<script setup lang="ts">
defineProps<{ icon: string; title: string; description: string }>();
</script>

<template>
  <div class="w-full flex float-start flex-col flex-nowrap gap-[10px] h-min justify-start overflow-visible p-[0px_0px_30px] relative border-b border-dashed border-dark-gray-4">
    <div class="flex items-center flex-none flex-nowrap gap-[6px] h-min justify-start overflow-visible p-0 relative w-full">
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.3, delay: 0.05 }"
        :in-view-options="{ once: true }"
        class="aspect-auto w-[30px] flex-none overflow-hidden relative"
      >
        <figure class="relative text-white top-0 left-0 right-0 bottom-0 rounded-[inherit]">
          <img width="30" height="30" :src="icon" alt="icon" class="block w-full h-full rounded-[inherit] object-cover object-center" />
        </figure>
      </Motion>
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.3, delay: 0.15 }"
        :in-view-options="{ once: true }"
        class="flex-1 w-full h-auto relative whitespace-pre-wrap break-words flex-col justify-start shrink-0"
      >
        <h2 class="font-bold text-[26px] text-white leading-[1.2em]">{{ title }}</h2>
      </Motion>
    </div>
    <Motion
      :initial="{ opacity: 0, y: 20 }"
      :while-in-view="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.3, delay: 0.2 }"
      :in-view-options="{ once: true }"
    >
      <p class="font-medium text-lg text-light-gray-2">{{ description }}</p>
    </Motion>
    <slot />
  </div>
</template>
