<script setup lang="ts">
import { briefcaseIconley } from "~/utils/assets";
const content = await useContent();
</script>

<template>
  <div class="flex items-start flex-none flex-col flex-nowrap gap-[30px] h-min justify-start overflow-visible relative w-full">
    <div class="flex-none h-auto relative w-full">
      <SectionHeading
        :icon="briefcaseIconley"
        title="My experience"
        description="Navigating diverse environments with adaptability and expertise for holistic solutions."
      />
    </div>
    <div class="w-full">
      <Motion
        as="ul"
        :initial="{ opacity: 0 }"
        :while-in-view="{ opacity: 1 }"
        class="flex flex-none flex-col gap-[10px] h-min justify-start overflow-visible p-0 relative w-full flex-nowrap items-start"
      >
        <Motion
          v-for="(exp, index) in content.experience"
          :key="exp.id"
          as="li"
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: index * 0.1 }"
          :in-view-options="{ once: true }"
          class="bg-very-dark-gray border border-dark-gray-3 w-full rounded-xl flex flex-col flex-nowrap gap-5 h-min justify-start overflow-visible p-4 sm:p-6 relative"
        >
          <div class="w-full grid grid-cols-[max-content_auto_max-content] flex-none items-center h-min flex-nowrap overflow-visible p-0 gap-4 relative">
            <div class="flex items-center flex-1 gap-3 h-min justify-start overflow-visible p-0 relative">
              <div class="bg-dark-gray-4 border border-border-color rounded-md flex float-none gap-[10px] h-min justify-center items-center overflow-visible relative w-min">
                <div class="flex-none aspect-square h-auto overflow-visible relative w-[40px] rounded-[inherit]">
                  <figure class="block absolute inset-0 rounded-[inherit]">
                    <img width="30" height="30" :src="exp.logo" alt="icon" class="block w-full h-full rounded-[inherit] object-cover object-center" />
                  </figure>
                </div>
              </div>
              <div class="flex float-none flex-nowrap items-start gap-[6px] h-min justify-center overflow-visible p-0 relative w-min">
                <div class="gap-0 flex h-min justify-start overflow-visible items-start flex-col flex-nowrap">
                  <div class="flex-none h-auto relative whitespace-pre w-auto flex flex-col justify-start shrink-0">
                    <p class="font-bold text-[20px] text-light-gray-4">{{ exp.company }}</p>
                  </div>
                  <div v-if="exp.link" class="flex-none h-auto relative whitespace-pre w-auto flex flex-col justify-start shrink-0">
                    <NuxtLink :to="exp.link" class="font-medium cursor-pointer text-[15px] text-light-gray-2">
                      {{ exp.link }}
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex gap-2 flex-wrap h-min overflow-visible p-0 w-fit items-center justify-start">
              <template v-if="exp.labels.length">
                <div
                  v-for="(labelItem, labelIndex) in exp.labels"
                  :key="labelIndex"
                  class="opacity-0 md:opacity-100 bg-dark-gray-2 border border-dark-gray-3 flex items-center justify-start flex-nowrap gap-[10px] h-min overflow-visible p-[4px_10px] relative w-min rounded-3xl"
                >
                  <div class="flex-none h-auto relative whitespace-pre w-auto flex flex-col justify-start shrink-0">
                    <p class="font-medium text-xs sm:text-[14px] text-light-gray-2">{{ labelItem }}</p>
                  </div>
                </div>
              </template>
            </div>

            <div class="flex gap-[10px] h-min overflow-visible p-0 w-fit items-center">
              <h3 class="text-light-gray-4 font-bold text-lg sm:text-[22px] leading-[1.2em]">{{ exp.year }}</h3>
            </div>
          </div>
          <div class="border border-dark-gray-3 rounded-xl bg-darkest-gray flex flex-none flex-col flex-nowrap gap-1 h-min justify-start overflow-visible p-4 relative w-full">
            <div class="flex flex-none shrink-0 flex-col justify-start relative whitespace-pre-wrap w-full break-words">
              <p class="text-light-gray-4 text-base font-bold">{{ exp.title }}</p>
            </div>
            <div class="flex flex-none shrink-0 flex-col justify-start relative whitespace-pre-wrap w-full break-words">
              <p class="text-light-gray-2 text-[15px] text-base font-medium">{{ exp.description }}</p>
            </div>
          </div>
        </Motion>
      </Motion>
    </div>
  </div>
</template>
