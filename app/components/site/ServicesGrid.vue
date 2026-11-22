<script setup lang="ts">
const content = await useContent();
</script>

<template>
  <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    <article v-for="s in content.services" :key="s.id" class="rounded-2xl border border-default bg-elevated/40 p-6">
      <div class="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10">
        <span
          class="size-6 bg-primary"
          aria-hidden="true"
          :style="{ maskImage: `url(${s.icon})`, WebkitMaskImage: `url(${s.icon})`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }"
        />
      </div>
      <h3 class="text-lg font-semibold text-highlighted">{{ s.title }}</h3>
      <p class="mt-2 leading-relaxed text-muted">{{ s.description }}</p>
    </article>
  </div>
</template>
