<script setup lang="ts">
const content = await useContent();
const tilt = (i: number) => `${((i * 37) % 9) - 4}deg`;
</script>

<template>
  <StagePanel id="stack" label="Stack">
    <div class="flex h-full flex-col justify-center gap-8">
      <div class="flex flex-col gap-3">
        <KineticText id="stack-heading" as="h2" class="display-md outline-text" text="Stack" />
        <p class="max-w-md text-lg text-muted">Languages, frameworks and tools I use day to day.</p>
      </div>
      <DropGroup as="ul" class="flex max-w-5xl flex-wrap gap-3">
        <li v-for="(s, i) in content.stack" :key="s.id" class="drop" :style="{ '--i': i, '--r': tilt(i) }">
          <a
            :href="s.link"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-3 border border-default bg-muted/40 px-5 py-3 text-lg font-medium text-toned transition-colors hover:border-[var(--ui-text-highlighted)] hover:bg-elevated hover:text-highlighted"
          >
            <img :src="s.logo" alt="" class="size-6 object-contain" />
            {{ s.title }}
          </a>
        </li>
      </DropGroup>
    </div>
  </StagePanel>
</template>
