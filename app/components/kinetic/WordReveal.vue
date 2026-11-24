<script setup lang="ts">
// Words drift up out of a blur one after another when the text comes into view. The text stays plain text in the DOM.
const props = withDefaults(defineProps<{ text: string; as?: string; delay?: number }>(), { as: "p", delay: 0 });
const el = ref<HTMLElement>();
const inView = useInView(el, { threshold: 0.2 });
const words = computed(() => props.text.split(/\s+/).filter(Boolean));
</script>

<template>
  <component :is="as" ref="el" class="w-reveal" :class="{ 'is-in': inView }" :style="{ '--delay': `${delay}ms` }">
    <template v-for="(w, i) in words" :key="i"><span class="w-word" :style="{ '--i': i }">{{ w }}</span>{{ i < words.length - 1 ? " " : "" }}</template>
  </component>
</template>
