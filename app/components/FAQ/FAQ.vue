<script setup lang="ts">
import { multiplyIcon } from "~/utils/assets";
import type { FAQ as FAQType } from "../../types";

defineProps<{ data: FAQType[] }>();

const openIndices = ref<number[]>([]);

const isOpen = (index: number) => openIndices.value.includes(index);

const handleToggle = (index: number) => {
  openIndices.value = isOpen(index)
    ? openIndices.value.filter((i) => i !== index)
    : [...openIndices.value, index];
};
</script>

<template>
  <div class="w-full">
    <div class="grid grid-cols-1 transition-all duration-500 lg:grid-cols-2 gap-[20px] w-full">
      <Motion
        v-for="(faq, index) in data"
        :key="index"
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: index * 0.1 }"
        :in-view-options="{ once: true }"
        class="flex w-full select-none"
      >
        <div class="w-full">
          <div
            class="cursor-pointer bg-very-dark-gray hover:bg-[#fff]/[0.03] duration-300 text-white p-6 border border-dark-gray-3 rounded-[14px] transition-all"
            @click="handleToggle(index)"
          >
            <div class="flex items-center gap-2 justify-between">
              <div class="flex flex-col">
                <Motion
                  as="p"
                  :animate="{ color: isOpen(index) ? 'rgb(230, 230, 230)' : 'rgb(153, 153, 153)' }"
                  class="text-[17px] font-medium"
                >
                  {{ faq.question }}
                </Motion>
              </div>
              <Motion
                class="bg-dark-gray-2 shrink-0 border border-dark-gray-4 rounded-[10px] flex items-center justify-center p-2"
                :animate="{ rotate: isOpen(index) ? 45 : 0 }"
              >
                <img
                  :src="multiplyIcon"
                  alt="toggle icon"
                  class="transition-opacity rotate-45 duration-500"
                  :style="{ opacity: isOpen(index) ? 1 : 0.6 }"
                  width="20"
                  height="20"
                />
              </Motion>
            </div>

            <AnimatePresence>
              <Motion
                v-if="isOpen(index)"
                key="answer"
                :initial="{ opacity: 0, height: 0 }"
                :animate="{ opacity: 1, height: 'auto' }"
                :exit="{ opacity: 0, height: 0 }"
                :transition="{ duration: 0.3 }"
              >
                <Motion
                  :initial="{ opacity: 0 }"
                  :animate="{ opacity: 1 }"
                  :exit="{ opacity: 0 }"
                  :transition="{ duration: 0.2 }"
                  class="bg-dark-gray-3 w-full h-[1px] my-4"
                />
                <Motion
                  as="p"
                  :initial="{ opacity: 0, y: 10 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :exit="{ opacity: 0, y: 10 }"
                  :transition="{ duration: 0.3 }"
                  class="text-light-gray-2 font-medium text-[16px]"
                >
                  {{ faq.answer }}
                </Motion>
              </Motion>
            </AnimatePresence>
          </div>
        </div>
      </Motion>
    </div>
  </div>
</template>
