<script setup lang="ts">
const content = await useContent();
</script>

<template>
  <ul class="flex flex-wrap gap-3">
    <li v-for="s in content.stack" :key="s.id">
      <a
        :href="s.link"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2.5 border border-default bg-muted/40 px-3.5 py-2 text-sm font-medium text-toned transition-colors hover:border-accented hover:text-highlighted focus-visible:outline-2 focus-visible:outline-primary"
      >
        <img :src="s.logo" alt="" class="size-5 object-contain" />
        {{ s.title }}
      </a>
    </li>
  </ul>
</template>
