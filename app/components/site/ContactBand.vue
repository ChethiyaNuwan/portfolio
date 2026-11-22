<script setup lang="ts">
const content = await useContent();
</script>

<template>
  <section class="py-16 sm:py-20">
    <UContainer>
      <div class="flex flex-col items-start justify-between gap-6 border border-default bg-muted/40 p-8 sm:flex-row sm:items-center sm:p-12">
        <div class="max-w-xl">
          <h2 class="text-3xl font-bold tracking-tight text-highlighted">Have a project in mind?</h2>
          <p class="mt-2 text-lg text-muted">Send me a message and I will reply as soon as I can.</p>
        </div>
        <UButton size="xl" :href="`mailto:${content.profile.email}`" icon="i-lucide-mail" label="Email me" />
      </div>
    </UContainer>
  </section>
</template>
