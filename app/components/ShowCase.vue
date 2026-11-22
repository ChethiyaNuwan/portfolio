<script setup lang="ts">
import { flyIcon, linkIcon, rightArrow } from "~/utils/assets";
import { myShowCases } from "~/data";

withDefaults(defineProps<{ isMore?: boolean; showData?: number }>(), {
  isMore: true,
  showData: 2,
});
</script>

<template>
  <section class="flex items-start flex-none flex-col flex-nowrap gap-[30px] h-min justify-start overflow-visible relative w-full">
    <div id="showcase" class="flex-none h-auto relative w-full">
      <SectionHeading
        title="Creative Design Showcase"
        :icon="flyIcon"
        description="Explore a collection of my most innovative and visually stunning design works."
      />
    </div>

    <div class="flex items-start flex-none flex-wrap gap-[10px] h-min justify-start overflow-visible p-0 relative w-full">
      <Motion
        v-for="(item, index) in myShowCases.slice(0, showData)"
        :key="item.id"
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: index * 0.1 }"
        :in-view-options="{ once: true }"
        class="flex-none h-auto relative w-full"
      >
        <div class="bg-very-dark-gray w-full border border-dark-gray-3 rounded-xl flex items-center flex-nowrap flex-col lg:flex-row gap-5 h-min justify-start overflow-visible p-4 lg:p-[8px_24px_8px_8px] relative">
          <div class="lg:flex-1 w-full rounded-xl h-[180px] relative">
            <figure class="lg:absolute relative h-full w-full inset-0 rounded-xl">
              <img
                :src="item.image"
                :alt="item.title"
                loading="lazy"
                class="absolute inset-0 h-full w-full block rounded-[inherit] object-cover object-center"
              />
            </figure>
          </div>

          <div class="flex items-start flex-1 flex-col flex-nowrap gap-6 h-min justify-start overflow-visible p-0 relative w-full">
            <div class="flex items-start flex-1 flex-col flex-nowrap gap-1 h-min justify-start overflow-visible p-0 relative w-full">
              <div class="flex items-center flex-none flex-nowrap gap-5 h-min justify-between overflow-visible p-0 relative w-full">
                <div class="flex-1 h-auto relative whitespace-pre-wrap break-words justify-start shrink-0 flex-col">
                  <h3 class="font-bold text-white text-[22px] leading-[1.2em]">{{ item.title }}</h3>
                </div>
              </div>
              <div class="flex-none h-min relative">
                <a
                  :href="`https://${item.link}`"
                  rel="noopener noreferrer"
                  target="_blank"
                  class="bg-almost-black border border-dark-gray-4 flex cursor-pointer items-center flex-nowrap gap-[6px] h-1 justify-center overflow-visible relative w-min rounded-lg custom-padding group hover:bg-dark-gray-4 transition-all duration-500"
                >
                  <div class="opacity-70 aspect-square h-auto overflow-visible w-5 relative flex-none group-hover:opacity-100 duration-500 transition-all">
                    <figure class="absolute inset-0 w-full h-full rounded-[inherit]">
                      <img :src="linkIcon" alt="Link icon" class="block w-full h-full object-cover object-center rounded-[inherit]" height="20" width="20" />
                    </figure>
                  </div>

                  <div class="flex-none h-auto relative whitespace-pre w-auto flex flex-col shrink-0 opacity-70 group-hover:opacity-100 transition-all duration-500">
                    <p class="text-light-gray-3 font-medium leading-[100%] text-[15px]">{{ item.link }}</p>
                  </div>
                </a>
              </div>

              <div class="mt-3 border-y border-dark-gray-3 flex flex-none gap-3 h-min justify-start overflow-visible px-0 py-1 relative w-full flex-nowrap items-center">
                <div class="flex flex-col shrink-0 flex-none h-auto whitespace-pre w-auto relative">
                  <p class="text-light-gray-2 text-[15px] font-medium">{{ item.type }}</p>
                </div>
                <div class="bg-medium-gray rounded-full h-[5px] aspect-square flex-none relative w-[5px]" />
                <div class="flex flex-col shrink-0 flex-none h-auto whitespace-pre w-auto relative">
                  <p class="text-light-gray-2 text-[15px] font-medium">{{ item.pages }} Pages</p>
                </div>
                <div class="bg-medium-gray rounded-full h-[5px] aspect-square flex-none relative w-[5px]" />
                <div class="flex flex-col shrink-0 flex-none h-auto whitespace-pre w-auto relative">
                  <p class="text-light-gray-2 text-[15px] font-medium">{{ item.theme }} Theme</p>
                </div>
              </div>
            </div>

            <div class="flex flex-col justify-start flex-none h-auto relative whitespace-pre-wrap w-full break-words">
              <p class="text-[15px] font-medium text-light-gray-2">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </Motion>
    </div>

    <div v-if="isMore" class="flex-1 h-auto relative w-full block">
      <NuxtLink
        to="/services#showcase"
        class="bg-almost-black rounded-[10px] border border-dark-gray-4 w-full flex cursor-pointer gap-[6px] p-[14px_18px] flex-nowrap justify-center items-center overflow-visible h-min relative group hover:bg-dark-gray-4 transition-all duration-500"
      >
        <div class="flex shrink-0 group-hover:opacity-100 transition-all duration-500 justify-start opacity-70 flex-none h-auto w-auto whitespace-pre relative">
          <p class="uppercase font-medium font-IBM_Plex_Mono text-[15px] text-very-light-gray">View All projects</p>
        </div>
        <div class="aspect-square flex-none h-auto relative overflow-hidden w-5 transition-all group-hover:opacity-100 duration-500 opacity-70">
          <figure class="absolute inset-0 rounded-[inherit]">
            <img :src="rightArrow" alt="Right arrow icon" class="block w-full h-full object-cover object-center rounded-[inherit] -rotate-45" height="10" width="10" />
          </figure>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
