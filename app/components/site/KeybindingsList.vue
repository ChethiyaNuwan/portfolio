<script setup lang="ts">
// Compact list of every keyboard shortcut, grouped. Shown in the footer popover.
import { BINDING_DOCS } from "~/utils/keybindings";

defineEmits<{ palette: [] }>();

const groups = computed(() => {
  const map = new Map<string, typeof BINDING_DOCS>();
  for (const d of BINDING_DOCS) map.set(d.group, [...(map.get(d.group) ?? []), d]);
  return [...map.entries()].map(([title, items]) => ({ title, items }));
});
</script>

<template>
  <div class="flex max-h-[min(70vh,34rem)] w-[min(24rem,90vw)] flex-col gap-4 overflow-y-auto p-4">
    <p class="font-display text-base font-semibold text-highlighted">Keyboard shortcuts</p>
    <section v-for="g in groups" :key="g.title">
      <h3 class="mb-1.5 text-xs font-medium text-dimmed">{{ g.title }}</h3>
      <dl class="flex flex-col">
        <div v-for="d in g.items" :key="d.action" class="flex items-center justify-between gap-4 py-1.5">
          <dt class="text-sm text-toned">{{ d.action }}</dt>
          <dd class="flex shrink-0 flex-wrap items-center justify-end gap-x-1.5 gap-y-1">
            <template v-for="(chord, ci) in d.keys" :key="ci">
              <span v-if="ci > 0" class="text-[0.65rem] text-dimmed">or</span>
              <span class="flex items-center gap-0.5"><UKbd v-for="k in chord" :key="k" :value="k" size="sm" /></span>
            </template>
          </dd>
        </div>
      </dl>
    </section>
    <UButton color="neutral" variant="ghost" size="sm" icon="i-lucide-search" label="Open the command palette" class="justify-start" @click="$emit('palette')" />
  </div>
</template>
