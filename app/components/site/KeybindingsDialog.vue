<script setup lang="ts">
// Popup with every keyboard shortcut. Opens from the footer ticker, or with "?".
import { BINDING_DOCS, KEYMAP, matchesAny } from "~/utils/keybindings";

const open = useState("keys-open", () => false);
const paletteOpen = useState("palette-open", () => false);

const groups = computed(() => {
  const map = new Map<string, typeof BINDING_DOCS>();
  for (const d of BINDING_DOCS) map.set(d.group, [...(map.get(d.group) ?? []), d]);
  return [...map.entries()].map(([title, items]) => ({ title, items }));
});

function openPalette() {
  open.value = false;
  setTimeout(() => (paletteOpen.value = true), 150);
}

function onKey(e: KeyboardEvent) {
  const el = e.target instanceof HTMLElement ? e.target : null;
  const typing = !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  if (typing || !matchesAny(e, KEYMAP.help)) return;
  if (paletteOpen.value) return;
  e.preventDefault();
  open.value = !open.value;
}

onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<template>
  <UModal v-model:open="open" title="Keyboard shortcuts" description="Everything you can do from the keyboard on this site." :ui="{ content: 'max-w-2xl' }">
    <template #body>
      <div class="flex flex-col gap-7">
        <section v-for="g in groups" :key="g.title">
          <h3 class="mb-3 font-display text-lg font-semibold text-highlighted">{{ g.title }}</h3>
          <dl class="divide-y divide-default border-y border-default">
            <div v-for="d in g.items" :key="d.action" class="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2.5">
              <dt class="text-toned">{{ d.action }}</dt>
              <dd class="flex flex-wrap items-center justify-end gap-x-3 gap-y-1.5">
                <template v-for="(chord, ci) in d.keys" :key="ci">
                  <span v-if="ci > 0" class="text-xs text-dimmed">or</span>
                  <span class="flex items-center gap-1"><UKbd v-for="k in chord" :key="k" :value="k" /></span>
                </template>
              </dd>
            </div>
          </dl>
        </section>
        <div>
          <UButton color="neutral" variant="outline" icon="i-lucide-search" label="Open the command palette" @click="openPalette" />
        </div>
      </div>
    </template>
  </UModal>
</template>
