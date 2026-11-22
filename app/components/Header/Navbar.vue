<script setup lang="ts">
import { Equal, X } from "lucide-vue-next";

const time = ref("");
const isMenuOpen = ref(false);
let intervalId: ReturnType<typeof setInterval> | undefined;

const pad = (num: number) => (num < 10 ? `0${num}` : `${num}`);

const updateTime = () => {
  const today = new Date();
  const hh = today.getHours();
  const period = hh >= 12 ? "PM" : "AM";
  const hour12 = hh % 12 || 12;
  time.value = `${pad(hour12)}:${pad(today.getMinutes())}:${pad(today.getSeconds())} ${period}`;
};

onMounted(() => {
  updateTime();
  intervalId = setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
  document.body.classList.remove("overflow-hidden");
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  document.body.classList.toggle("overflow-hidden");
};
</script>

<template>
  <nav class="p-6 border-b border-border-color">
    <div class="flex items-center justify-between">
      <AvailableForWorkBtn />
      <div class="hidden md:flex items-center gap-3">
        <p class="text-light-gray-2 font-medium">Local Time (IST)</p>
        <div class="bg-dark-gray-1 border-[rgb(24,24,26)] p-[14px_18px] w-[130px] rounded-xl flex items-center justify-center">
          <p class="text-light-gray-4 text-base leading-[1em] font-semibold tracking-[0.07em] whitespace-nowrap">{{ time }}</p>
        </div>
      </div>
      <button
        type="button"
        class="h-11 w-11 rounded-full bg-almost-black hover:bg-dark-gray-4 border-dark-gray-4 transition-all duration-500 cursor-pointer md:hidden relative z-[2000] flex items-center justify-center"
        @click="toggleMenu"
      >
        <span>
          <X v-if="isMenuOpen" :size="24" class="text-light-gray-3" />
          <Equal v-else :size="24" class="text-light-gray-3" />
        </span>
      </button>
    </div>
  </nav>
  <!-- SideNavbar for mobile -->
  <div v-if="isMenuOpen" class="fixed inset-0 bg-black/50 z-10" @click="toggleMenu">
    <SideNavbar :is-menu-open="isMenuOpen" />
  </div>
</template>
