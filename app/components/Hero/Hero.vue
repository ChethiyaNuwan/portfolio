<script setup lang="ts">
import { FileUser, Send } from "lucide-vue-next";
import { handGif } from "~/utils/assets";

const content = await useContent();
const profile = computed(() => content.value.profile);
const spring = (delay: number) => ({ duration: 0.5, type: "spring" as const, stiffness: 100, delay });
</script>

<template>
  <div class="flex flex-none flex-col flex-nowrap gap-[30px] h-min justify-start overflow-visible p-0 relative w-full">
    <!-- top -->
    <section class="flex flex-col lg:flex-row items-center flex-none flex-nowrap gap-[20px] h-min justify-start overflow-visible p-0 relative w-full">
      <div class="flex w-full items-center flex-none flex-nowrap flex-col gap-[10px] h-min justify-center p-0 relative md:w-min overflow-hidden">
        <div class="aspect-auto flex-none h-auto w-[260px] relative bg-image-bg rounded-lg">
          <figure class="h-full w-full">
            <img :src="profile.avatar" alt="Avatar" width="300" height="300" class="w-full h-full object-cover rounded-lg" />
            <AnimatedImageGrid />
          </figure>
        </div>
      </div>
      <div class="flex flex-col items-start gap-2 p-0 relative w-full h-auto">
        <div class="flex flex-col gap-1">
          <Motion :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="spring(0.1)" class="flex items-center gap-1">
            <span>
              <img :src="handGif" class="waveHand" alt="Hand Gesture" width="25" height="25" />
            </span>
            <p class="text-light-gray-2 font-bold leading-[1.2em] text-[20px]">Hello, I'm</p>
          </Motion>
          <Motion as="h1" :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="spring(0.2)" class="text-4xl leading-[1.2em] font-bold text-white">
            {{ profile.name }}
          </Motion>
        </div>

        <Motion as="p" :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="spring(0.3)" class="text-[18px] text-light-gray-2 font-medium leading-[150%] mb-4">
          {{ profile.intro }}
        </Motion>

        <Motion :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="spring(0.4)" class="flex items-start flex-none flex-nowrap w-full gap-5 h-min justify-start p-0 relative">
          <AppButton title="Contact Me" :icon="Send" :href="`mailto:${profile.email}`" />
          <AppButton
            title="Download CV"
            :icon="FileUser"
            href="/cv"
            target="_blank"
            :download="`${profile.name}_CV.pdf`"
            type="application/pdf"
            class-name="bg-white text-black"
          />
        </Motion>
      </div>
    </section>
    <!-- middle -->
    <Motion :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="spring(0.6)">
      <!-- bottom -->
      <CounterContainer />
    </Motion>
  </div>
</template>
