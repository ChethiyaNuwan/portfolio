<script setup lang="ts">
const content = await useContent();
</script>

<template>
  <section class="pb-6">
    <UContainer>
      <dl class="grid grid-cols-2 divide-default rounded-2xl border border-default sm:grid-cols-4 sm:divide-x">
        <div v-for="c in content.counters" :key="c.id" class="p-5 text-center">
          <dt class="text-sm text-muted">{{ c.title }}</dt>
          <dd class="mt-1 text-3xl font-semibold text-highlighted">
            <CountUp :end="c.value" /><span class="text-primary">+</span>
          </dd>
        </div>
      </dl>
    </UContainer>
  </section>
</template>
