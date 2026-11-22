<script setup lang="ts">
import { rightArrow, stackIcon } from "~/utils/assets";
import { myStack } from "~/data";
</script>

<template>
  <div class="flex items-start flex-none flex-col flex-nowrap gap-[30px] h-min justify-start overflow-visible relative w-full">
    <div class="flex-none h-auto relative w-full">
      <SectionHeading
        :icon="stackIcon"
        title="My Stacks"
        description="Commitment to staying updated with the latest design trends and techniques."
      />
    </div>
    <div class="w-full">
      <Motion
        as="ul"
        :initial="{ opacity: 0 }"
        :while-in-view="{ opacity: 1 }"
        class="grid gap-[10px] flex-none auto-rows-min h-min justify-center overflow-visible relative p-0 w-full md:grid-cols-[repeat(2,minmax(50px,1fr))] grid-cols-1 lg:grid-rows-[repeat(2,min-content)]"
      >
        <Motion
          v-for="(stack, index) in myStack"
          :key="stack.id"
          as="li"
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: index * 0.1 }"
          :in-view-options="{ once: true }"
          class="w-full"
        >
          <NuxtLink
            :to="stack.link"
            class="w-full bg-very-dark-gray border border-dark-gray-3 rounded-xl flex cursor-pointer items-center flex-nowrap gap-[10px] h-min justify-start overflow-visible relative p-[14px_24px_14px_14px] group hover:bg-almost-black transition-all duration-500"
          >
            <!-- logo -->
            <div class="bg-dark-gray-4 border border-border-color rounded-[7px] flex items-center flex-none flex-nowrap gap-[10px] h-min justify-center overflow-hidden p-2 relative w-min">
              <div class="aspect-square flex-none h-auto overflow-hidden relative w-[30px]">
                <figure class="relative inset-0 rounded-[inherit]">
                  <img :src="stack.logo" :alt="stack.title" class="block w-full h-full rounded-[inherit] object-cover object-center" />
                </figure>
              </div>
            </div>
            <!-- text -->
            <div class="flex items-start flex-1 flex-col flex-nowrap gap-0 h-min justify-start overflow-visible p-0 relative">
              <div class="flex flex-col shrink-0 flex-none h-auto relative whitespace-pre-wrap w-full break-words">
                <p class="text-light-gray-4 font-semibold text-[18px]">{{ stack.title }}</p>
              </div>
              <div class="flex flex-col shrink-0 flex-none h-auto relative whitespace-pre-wrap w-full break-words">
                <p class="text-light-gray-2 font-medium text-[15px]">{{ stack.description }}</p>
              </div>
            </div>
            <!-- arrow -->
            <div class="aspect-square flex-none h-auto w-[24px] overflow-hidden relative opacity-50 group-hover:opacity-100">
              <div class="absolute rounded-full inset-0 flex items-center justify-center w-full h-full">
                <img :src="rightArrow" alt="arrow" width="24" height="24" class="block w-full h-full rounded-full object-cover object-center transition-all duration-500 group-hover:-rotate-45" />
              </div>
            </div>
          </NuxtLink>
        </Motion>
      </Motion>
    </div>
  </div>
</template>
