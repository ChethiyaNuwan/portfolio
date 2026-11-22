<script setup lang="ts">
import { CountUp } from "countup.js";

const props = defineProps<{ end: number }>();
const el = ref<HTMLElement>();

onMounted(() => {
  if (!el.value) return;
  const counter = new CountUp(el.value, props.end, { duration: 2, useGrouping: false });
  if (!counter.error) counter.start();
});
</script>

<template>
  <span ref="el">0</span>
</template>
