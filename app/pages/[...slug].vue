<script setup lang="ts">
import { Undo2 } from "lucide-vue-next";

if (import.meta.server) {
  setResponseStatus(useRequestEvent()!, 404);
}
useHead({ title: "404 • Page Not Found" });
</script>

<template>
  <div class="flex items-center justify-center h-full flex-col py-36 w-full">
    <h2 class="text-7xl font-bold text-light-gray-3 mb-1">404</h2>
    <p class="font-semibold text-light-gray-4 text-xl">Page Not Found</p>
    <div class="my-10">
      <NuxtLink
        to="/"
        class="px-3 py-2 rounded-3xl bg-almost-black border border-border-color flex items-center gap-2 hover:bg-dark-gray-4 group transition-all w-min duration-500 flex-nowrap"
      >
        <span class="text-light-gray-2 group-hover:text-light-gray-4 transition-all duration-500 whitespace-nowrap">
          <Undo2 :size="17" />
        </span>
        <span class="text-light-gray-2 group-hover:text-light-gray-4 transition-all duration-500 whitespace-nowrap">
          Back to Home
        </span>
      </NuxtLink>
    </div>
  </div>
</template>
