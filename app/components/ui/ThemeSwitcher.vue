<script setup lang="ts">
import { Sun, Moon, Monitor } from "lucide-vue-next";

type Theme = "light" | "system" | "dark";

const themes = [
  { value: "light", label: "Light Theme", icon: Sun },
  { value: "system", label: "System Theme", icon: Monitor },
  { value: "dark", label: "Dark Theme", icon: Moon },
] as const;

const colorMode = useColorMode();

const setTheme = (theme: Theme) => {
  colorMode.preference = theme;
};
</script>

<template>
  <div class="flex py-1 bg-transparent rounded-3xl px-1 border border-dark-gray-4 gap-1" role="radiogroup" aria-label="Theme Switcher">
    <button
      v-for="t in themes"
      :key="t.value"
      type="button"
      :class="[
        'inline-block p-2 cursor-pointer rounded-full text-light-gray-1 hover:text-white',
        colorMode.value === t.value && 'bg-dark-gray-3 text-light-gray-4',
      ]"
      :aria-checked="colorMode.value === t.value"
      :aria-label="t.label"
      role="radio"
      @click="setTheme(t.value)"
    >
      <component :is="t.icon" :size="16" />
    </button>
  </div>
</template>
