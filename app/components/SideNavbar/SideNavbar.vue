<script setup lang="ts">
import { ArrowUp } from "lucide-vue-next";
import { AvatarMe } from "~/utils/assets";
import { pagesLists } from "~/data";

defineProps<{ isMenuOpen?: boolean }>();

const route = useRoute();
</script>

<template>
  <Motion
    :initial="{ x: '-100%' }"
    :animate="{ x: 0 }"
    :exit="{ x: '-100%' }"
    :transition="{ duration: 0.5, type: 'spring' }"
    class="absolute lg:block max-w-[13%] w-full border-r border-border-color h-screen md:sticky top-0 flex-none z-10"
    :style="{ left: isMenuOpen ? '0' : '-100%', maxWidth: isMenuOpen ? '140px' : '13%' }"
  >
    <div class="flex items-end justify-between h-full flex-none flex-nowrap relative p-[20px_30px_40px_0px] flex-col">
      <!-- top -->
      <NuxtLink
        to="/"
        class="bg-border-color rounded-full w-[60px] border border-zinc-800 hover:scale-95 transition-all duration-300 h-auto aspect-square p-[4px] relative overflow-hidden flex items-center justify-center flex-none flex-nowrap gap-[10px]"
      >
        <div class="w-[50px] aspect-square h-auto rounded-full flex-none relative bg-darkest-gray">
          <div class="absolute rounded-full inset-0">
            <img :src="AvatarMe" width="300" height="300" alt="Avatar" class="block w-full h-full rounded-full opacity-80 object-fill object-center" />
          </div>
        </div>
      </NuxtLink>
      <!-- middle -->
      <Motion
        as="ul"
        :initial="{ opacity: 0 }"
        :while-in-view="{ opacity: 1 }"
        class="flex flex-col flex-none flex-nowrap gap-[20px] h-min justify-start p-0 relative w-min z-10 items-start"
      >
        <Motion
          v-for="(page, index) in pagesLists"
          :key="page.id"
          as="li"
          :initial="{ opacity: 0, x: -20 }"
          :while-in-view="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.5, delay: index * 0.2 }"
          :in-view-options="{ once: true }"
        >
          <NuxtLink
            :to="page.href"
            :class="[
              'p-3.5 group flex cursor-pointer border border-transparent items-center justify-center transition-all duration-300 h-min w-min relative rounded-xl',
              route.path === page.href
                ? 'bg-almost-black border-dark-gray-3 text-white'
                : 'hover:bg-very-dark-gray hover:border-dark-gray-3',
            ]"
          >
            <span :class="route.path === page.href ? 'text-light-gray-3' : 'text-light-gray-2'">
              <component :is="page.icon" :size="page.iconSize" />
            </span>

            <Tooltip :content="page.title" position="right" />
          </NuxtLink>
        </Motion>
      </Motion>
      <!-- bottom -->
      <Motion
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.3, delay: 0.1, type: 'spring', stiffness: 120 }"
        class="relative group items-center w-full flex justify-end max-w-max"
      >
        <a
          href="#top"
          class="p-3.5 flex cursor-pointer border border-transparent overflow-hidden items-center justify-center h-min w-min relative rounded-xl hover:bg-very-dark-gray hover:border-dark-gray-3"
        >
          <span class="text-light-gray-2"><ArrowUp :size="24" /></span>
        </a>
        <Tooltip content="Go to Top" position="top" />
      </Motion>
    </div>
  </Motion>
</template>
