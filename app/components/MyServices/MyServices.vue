<script setup lang="ts">
import { rightArrow, zapIcon } from "~/utils/assets";
import { myServices } from "~/data";
</script>

<template>
  <div class="flex items-start flex-none flex-col flex-nowrap gap-[30px] h-min justify-start overflow-visible relative w-full">
    <div class="flex-none h-auto relative w-full">
      <SectionHeading
        :icon="zapIcon"
        title="My Services"
        description="Formulating comprehensive strategies to meet your design goals and exceed expectations."
      />
    </div>
    <div class="w-full">
      <Motion
        as="ul"
        :initial="{ opacity: 0 }"
        :while-in-view="{ opacity: 1 }"
        class="grid gap-[10px] flex-none auto-rows-min h-min justify-center overflow-visible relative p-0 w-full grid-cols-1 lg:grid-cols-[repeat(2,minmax(50px,1fr))] lg:grid-rows-[repeat(2,min-content)]"
      >
        <Motion
          v-for="(service, index) in myServices"
          :key="service.id"
          as="li"
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: index * 0.1 }"
          :in-view-options="{ once: true }"
          class="w-full"
        >
          <NuxtLink
            :to="service.link"
            class="bg-very-dark-gray border border-dark-gray-3 rounded-xl w-full cursor-pointer items-start flex flex-col flex-nowrap gap-[14px] h-min justify-start overflow-visible p-5 relative group"
          >
            <!-- top -->
            <div class="flex items-center flex-none flex-nowrap gap-[10px] h-min justify-start overflow-visible p-0 relative w-full">
              <div class="flex flex-none items-center flex-nowrap gap-[10px] h-min justify-center overflow-hidden p-2 relative w-min border border-border-color bg-dark-gray-3 rounded-lg">
                <div class="aspect-square flex-none h-auto overflow-hidden relative w-[30px]">
                  <figure class="absolute inset-0 rounded-[inherit] w-full h-full">
                    <img width="30" height="30" :src="service.icon" alt="icon" class="block w-full h-full rounded-[inherit] object-cover object-center" />
                  </figure>
                </div>
              </div>

              <div class="flex-1 flex flex-col justify-start shrink-0 h-auto relative whitespace-pre-wrap break-words">
                <p class="font-bold text-[20px] text-white leading-[1.2em]">{{ service.title }}</p>
              </div>

              <div class="aspect-square h-auto flex-none overflow-hidden relative w-[30px] transition-all duration-500 opacity-0 group-hover:opacity-100">
                <figure class="absolute top-0 left-0 right-0 bottom-0 rounded-[inherit]">
                  <img width="20" height="20" :src="rightArrow" alt="icon" class="block w-full h-full rounded-[inherit] object-cover object-center group-hover:-rotate-45 transition-all duration-500" />
                </figure>
              </div>
            </div>
            <!-- bottom -->
            <div class="flex flex-none shrink-0 flex-col justify-start h-auto relative whitespace-pre-wrap w-full break-words">
              <p class="text-light-gray-2 text-[15px] font-medium">{{ service.description }}</p>
            </div>
          </NuxtLink>
        </Motion>
      </Motion>
    </div>
  </div>
</template>
