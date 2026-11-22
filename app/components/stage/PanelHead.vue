<script setup lang="ts">
// The heading row shared by the content sections, so every title sits in the same place at the same size.
// Filled and outline styles alternate from one section to the next.
defineProps<{ id: string; title: string; outline?: boolean }>();
</script>

<template>
  <header class="flex min-h-[7rem] flex-wrap items-end justify-between gap-x-8 gap-y-3">
    <KineticText :id="`${id}-heading`" as="h2" class="display-md" :class="{ 'outline-text': outline }" :text="title" />
    <div class="flex flex-wrap items-center gap-4"><slot /></div>
  </header>
</template>
