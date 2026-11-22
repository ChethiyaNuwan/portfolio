<script setup lang="ts">
import { counterLists } from "~/data";
</script>

<template>
  <Motion
    :initial="{ opacity: 0, y: 30 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.5, type: 'spring', stiffness: 100, delay: 0.7 }"
    class="flex flex-none gap-5 flex-nowrap h-min justify-start py-5 relative px-0 overflow-visible items-start border-b border-dashed border-t border-dark-gray-4 w-full"
  >
    <ul class="grid grid-cols-2 sm:flex items-center gap-2 justify-between w-full">
      <li v-for="list in counterLists" :key="list.id" class="w-full">
        <div class="flex-1 flex flex-nowrap gap-[4px] h-min p-0 relative items-center overflow-visible justify-center">
          <div class="flex-none h-auto relative w-auto">
            <div class="items-start justify-start text-[28px] font-bold text-very-light-gray">
              <CountUp :end="list.value" />
            </div>
          </div>
          <div class="flex shrink-0 flex-col justify-start float-none h-auto relative whitespace-pre w-auto">
            <h1 class="text-[34px] font-bold text-white">+</h1>
          </div>
        </div>
        <div class="flex shrink-0 flex-col justify-start w-full flex-none relative whitespace-pre-wrap break-words">
          <p class="text-center text-light-gray-2 font-medium text-[15px]">{{ list.title }}</p>
        </div>
      </li>
    </ul>
  </Motion>
</template>
