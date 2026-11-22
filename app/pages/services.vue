<script setup lang="ts">
import { zapIcon } from "~/utils/assets";
import { myServicesPlans } from "~/data";

useSeoMeta({
  title: "Chethiya Nuwan • Services",
  description:
    "Explore the services i offer. Professional web development, design, and software engineering solutions.",
});
</script>

<template>
  <div class="flex flex-1 flex-col gap-0 h-min overflow-hidden p-0 relative w-full flex-nowrap items-center justify-start">
    <div class="gap-[60px] flex-col max-w-full w-full lg:max-w-[750px] px-5 lg:px-0 lg:w-[80%] flex-nowrap flex items-center flex-none h-min justify-center relative overflow-visible p-[80px_0px]">
      <SectionHeading
        :icon="zapIcon"
        title="My Services"
        description="Formulating comprehensive strategies to meet your design goals and exceed expectations."
      />

      <div class="flex-0 w-full gap-[10px] h-min grid justify-center overflow-visible p-0 relative grid-cols-1 lg:grid-cols-[repeat(2,minmax(50px,1fr))] lg:grid-rows-[repeat(2,min-content)]">
        <Motion
          v-for="(plan, index) in myServicesPlans"
          :key="plan.id"
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: index * 0.1 }"
          :in-view-options="{ once: true, amount: 0.5 }"
          class="place-self-start h-auto w-full relative"
        >
          <div class="rounded-xl flex flexFlow items-end place-items-end gap-5 h-min p-6 relative border bg-very-dark-gray border-dark-gray-3">
            <div class="flex flex-col gap-4 h-min p-0 relative w-full">
              <!-- Top Section -->
              <div class="flex justify-between items-center h-min w-full">
                <div class="flex items-center gap-2 flex-1">
                  <div class="bg-dark-gray-3 border border-border-color rounded-lg flex items-center justify-center p-2 w-auto">
                    <div class="aspect-square w-[24px] h-[24px] overflow-hidden">
                      <img
                        width="24"
                        height="24"
                        :src="plan.icon"
                        alt="calendar"
                        class="object-cover object-center w-full h-full"
                      />
                    </div>
                  </div>

                  <div class="flex flex-col flex-1 justify-start">
                    <p class="font-bold text-[20px] text-very-light-gray">
                      {{ plan.service }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Bottom Section with Description -->
              <div class="flex flex-col h-auto whitespace-pre-wrap w-full">
                <p class="font-semibold text-[15px] text-light-gray-2">
                  {{ plan.description }}
                </p>
              </div>
            </div>

            <div class="flex flex-col gap-2 h-auto w-full rounded-xl border border-dark-gray-3 py-2">
              <div
                v-for="row in [
                  { label: 'Completed Works', value: plan.completedWorks },
                  { label: 'Experiences', value: plan.experience },
                ]"
                :key="row.label"
                class="flex justify-between items-center last:border-transparent border-b border-dark-gray-3 py-2 px-4 w-full"
              >
                <div class="flex-1">
                  <p class="font-medium text-[15px] text-light-gray-2">{{ row.label }}</p>
                </div>
                <div class="flex-1 text-right">
                  <p class="font-bold text-[18px] text-light-gray-4">{{ row.value }}</p>
                </div>
              </div>
            </div>
          </div>
        </Motion>
      </div>

      <MyStack />
      <ShowCase :is-more="false" :show-data="4" />
    </div>
  </div>
</template>
