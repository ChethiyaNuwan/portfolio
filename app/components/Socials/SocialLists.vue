<script setup lang="ts">
import { socialIconMap } from "~/utils/icons";

const content = await useContent();
</script>

<template>
  <aside class="hidden lg:block max-w-[13%] w-full h-screen top-0 flex-none sticky z-10">
    <div class="flex items-start overflow-hidden justify-center h-full flex-nowrap relative p-0 flex-col gap-2">
      <div class="flex items-start overflow-hidden justify-center h-full flex-nowrap relative p-[20px_0px_40px_30px] flex-col flex-1 border-l border-border-color">
        <Motion as="ul" :initial="{ opacity: 0 }" :while-in-view="{ opacity: 1 }" class="flex items-center gap-5 flex-col">
          <Motion
            v-for="(social, index) in content.socials"
            :key="social.id"
            as="li"
            :initial="{ opacity: 0, x: 20 }"
            :while-in-view="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.5, delay: index * 0.2 }"
            :in-view-options="{ once: true }"
            class="flex items-center gap-10"
          >
            <NuxtLink
              :to="social.link"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-very-dark-gray hover:bg-dark-gray-3 transition-all duration-300 border border-dark-gray-3 p-3 group rounded-xl"
            >
              <span class="text-light-gray-1 text-sm group-hover:text-light-gray-3 transition-all duration-300">
                <component :is="socialIconMap[social.icon]" :size="22" />
              </span>
            </NuxtLink>
          </Motion>
        </Motion>
      </div>
    </div>
  </aside>
</template>
