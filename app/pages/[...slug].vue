<script setup lang="ts">
if (import.meta.server) {
  setResponseStatus(useRequestEvent()!, 404);
}
useHead({ title: "Page not found" });
</script>

<template>
  <section class="py-28">
    <UContainer class="flex flex-col items-center gap-4 text-center">
      <p class="font-display text-7xl font-bold text-primary">404</p>
      <h1 class="text-2xl font-semibold text-highlighted">Page not found</h1>
      <p class="max-w-md text-muted">The page you are looking for does not exist or has moved.</p>
      <UButton to="/" icon="i-lucide-arrow-left" label="Back to home" />
    </UContainer>
  </section>
</template>
