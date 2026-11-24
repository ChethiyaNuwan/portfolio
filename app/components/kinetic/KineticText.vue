<script setup lang="ts">
// Letters rise into place when the text scrolls into view. The text stays real, readable text in the DOM.
const props = withDefaults(defineProps<{ text: string; as?: string; delay?: number; loop?: boolean }>(), { as: "span", delay: 0, loop: false });
const el = ref<HTMLElement>();
const inView = useInView(el, { threshold: 0.2 });

const words = computed(() => {
  let n = 0;
  return props.text.split(" ").map((w) => {
    const start = n;
    n += w.length;
    return { w, chars: [...w], start };
  });
});
</script>

<template>
  <component :is="as" ref="el" class="k-text" :class="{ 'is-in': inView, 'k-loop': loop }" :style="{ '--delay': `${delay}ms` }">
    <template v-for="(word, wi) in words" :key="wi">
      <span class="k-word"><span v-for="(ch, ci) in word.chars" :key="ci" class="k-char" :style="{ '--i': word.start + ci }">{{ ch }}</span></span>{{ wi < words.length - 1 ? " " : "" }}
    </template>
  </component>
</template>
