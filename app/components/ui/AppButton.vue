<script setup lang="ts">
import type { Component } from "vue";

const props = withDefaults(
  defineProps<{
    icon?: Component;
    iconSize?: number;
    title: string;
    onClick?: () => void;
    position?: "left" | "right";
    href?: string;
    className?: string;
    target?: "_blank" | "_self" | "_parent" | "_top";
    download?: boolean | string;
    type?: string;
  }>(),
  {
    position: "left",
    className: "",
    target: "_self",
    download: false,
    type: "",
    iconSize: 18,
  },
);

const classes = computed(() => [
  "transition-all duration-300 rounded-[10px] border border-dark-gray-4 flex gap-[6px] cursor-pointer items-center flex-nowrap justify-center overflow-visible p-[14px_18px] relative group",
  props.position === "left" ? "flex-row" : "flex-row-reverse",
  !/w-(\S+)/.test(props.className) && "w-full",
  props.className,
]);
</script>

<template>
  <a
    v-if="href"
    :href="href"
    class="w-full"
    :download="download || undefined"
    :target="target"
    :type="type || undefined"
  >
    <span :class="classes">
      <span v-if="icon" class="opacity-70"><component :is="icon" :size="iconSize" /></span>
      <span class="flex-none h-auto relative w-auto whitespace-pre opacity-70 shrink-0 flex-col justify-start flex group-hover:opacity-100">
        <span :class="['uppercase font-medium font-IBM_Plex_Mono leading-[100%] text-[15px] whitespace-pre', className]">{{ title }}</span>
      </span>
    </span>
  </a>
  <button v-else type="button" :class="classes" @click="onClick?.()">
    <span v-if="icon" class="opacity-70"><component :is="icon" :size="iconSize" /></span>
    <span class="flex-none h-auto relative w-auto whitespace-pre opacity-70 shrink-0 flex-col justify-start flex group-hover:opacity-100">
      <span :class="['uppercase font-medium font-IBM_Plex_Mono leading-[100%] text-[15px] whitespace-pre', className]">{{ title }}</span>
    </span>
  </button>
</template>
