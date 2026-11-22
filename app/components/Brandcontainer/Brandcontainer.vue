<script setup lang="ts">
import { socialBrands } from "~/data";
</script>

<template>
  <div class="flex flex-none flex-nowrap gap-[30px] h-min overflow-hidden relative w-full p-[0px_0px_10px]">
    <section class="maskImage w-full max-w-full p-[10px] max-h-full flex overflow-hidden justify-between">
      <Marquee class="gap-7 w-full">
        <ul class="flex shrink-0 w-full h-full max-w-full max-h-full place-items-center ml-20 p-0 gap-7 relative">
          <li v-for="brand in socialBrands" :key="brand.id" class="h-full w-full">
            <NuxtLink
              class="cursor-pointer h-[45px] relative block shrink-0 overflow-hidden w-[80px]"
              :to="brand.link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div class="absolute shrink-0 top-0 left-0 right-0 bottom-0 rounded-[inherit]">
                <img :src="brand.icon" class="w-full block shrink-0 h-full object-contain rounded-[inherit]" :alt="brand.name" width="80" height="45" />
              </div>
            </NuxtLink>
          </li>
        </ul>
      </Marquee>
    </section>
  </div>
</template>
