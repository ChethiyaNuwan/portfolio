<script setup lang="ts">
// Education entries (edited in the admin under Education), shown under the experience tree.
const content = await useContent();
const points = (details: string) => details.split("\n").map((l) => l.trim()).filter(Boolean);
</script>

<template>
  <section v-if="content.education.length" aria-labelledby="education-heading" class="mt-12 border-t border-default pt-8">
    <h3 id="education-heading" class="font-display text-2xl font-semibold text-highlighted">Education</h3>
    <DropGroup as="ul" class="mt-5 grid gap-4 md:grid-cols-2" role="list">
      <li v-for="(e, i) in content.education" :key="e.id" class="drop flex flex-col gap-2 border border-default bg-muted/40 p-5" :style="{ '--i': i }">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <UIcon name="i-lucide-graduation-cap" class="size-4 text-primary" aria-hidden="true" />
          <time v-if="e.period" class="font-medium text-toned">{{ e.period }}</time>
        </div>
        <h4 class="font-display text-xl font-semibold leading-tight text-highlighted">{{ e.degree || e.school }}</h4>
        <p v-if="e.degree && e.school" class="text-toned">{{ e.school }}</p>
        <ul v-if="points(e.details).length" class="mt-1 flex list-disc flex-col gap-1 pl-5 text-sm leading-relaxed text-muted">
          <li v-for="(p, n) in points(e.details)" :key="n">{{ p }}</li>
        </ul>
      </li>
    </DropGroup>
  </section>
</template>
