<script setup lang="ts">
// Footer control that cycles through the key bindings, sliding each one up in turn with what it does.
// Clicking (or pressing "?") opens a small popover above it listing every binding.
// (Reduced motion: shows the first binding without cycling.)
import { KEYMAP, TICKER, matchesAny } from "~/utils/keybindings";

const open = useState("keys-open", () => false);
const paletteOpen = useState("palette-open", () => false);
const index = ref(0);
const paused = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;

const current = computed(() => TICKER[index.value % TICKER.length]!);

function openPalette() {
  open.value = false;
  setTimeout(() => (paletteOpen.value = true), 150);
}

function onKey(e: KeyboardEvent) {
  const el = e.target instanceof HTMLElement ? e.target : null;
  const typing = !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  if (typing || paletteOpen.value || !matchesAny(e, KEYMAP.help)) return;
  if (!window.matchMedia("(min-width: 1024px)").matches) return; // the control is only shown on larger screens
  e.preventDefault();
  open.value = !open.value;
}

onMounted(() => {
  window.addEventListener("keydown", onKey);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  timer = setInterval(() => {
    if (!paused.value && !open.value) index.value++;
  }, 2600);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  clearInterval(timer);
});
</script>

<template>
  <UPopover v-model:open="open" :content="{ side: 'top', align: 'end', sideOffset: 14 }">
    <button
      type="button"
      class="key-ticker hidden lg:flex"
      aria-label="Show keyboard shortcuts"
      aria-keyshortcuts="Shift+/"
      @mouseenter="paused = true"
      @mouseleave="paused = false"
      @focus="paused = true"
      @blur="paused = false"
    >
      <!-- wide windows: the cycling binding -->
      <span class="key-ticker-window hidden xl:block" aria-hidden="true">
        <Transition name="tick" mode="out-in">
          <span :key="index % TICKER.length" class="key-ticker-row">
            <span class="flex items-center gap-1"><UKbd v-for="k in current.keys" :key="k" :value="k" size="sm" /></span>
            <span class="truncate text-sm text-toned">{{ current.action }}</span>
          </span>
        </Transition>
      </span>
      <!-- narrower desktop windows: just a "?" key cap -->
      <UKbd class="xl:hidden" value="?" size="md" aria-hidden="true" />
    </button>

    <template #content>
      <KeybindingsList @palette="openPalette" />
    </template>
  </UPopover>
</template>
