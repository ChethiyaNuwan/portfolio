<script setup lang="ts">
const content = await useContent();
const mask = (src: string) => ({ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" });
</script>

<template>
  <StagePanel id="services" label="Services">
    <div class="flex h-full flex-col justify-center gap-10">
      <KineticText id="services-heading" as="h2" class="display-md" text="Services" />
      <DropGroup as="ul" class="grid gap-6 lg:grid-cols-3">
        <li v-for="(s, i) in content.services" :key="s.id" class="drop flex flex-col gap-4 border-t-2 border-[var(--ui-text-highlighted)] pt-6" :style="{ '--i': i }">
          <span class="size-10 bg-primary" aria-hidden="true" :style="mask(s.icon)" />
          <h3 class="font-display text-3xl font-semibold text-highlighted sm:text-4xl">{{ s.title }}</h3>
          <p class="max-w-sm text-lg leading-relaxed text-muted">{{ s.description }}</p>
        </li>
      </DropGroup>
    </div>
  </StagePanel>
</template>
