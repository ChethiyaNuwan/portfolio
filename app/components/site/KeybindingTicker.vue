<script setup lang="ts">
// Footer button that cycles through the key bindings, sliding each one up in turn with what it does.
// Clicking opens the full list. (Reduced motion: shows the first binding without cycling.)
import { TICKER } from "~/utils/keybindings";

const open = useState("keys-open", () => false);
const index = ref(0);
const paused = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;

const current = computed(() => TICKER[index.value % TICKER.length]!);

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  timer = setInterval(() => {
    if (!paused.value && !open.value) index.value++;
  }, 2600);
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <div>
    <button
      type="button"
      class="key-ticker hidden xl:flex"
      aria-haspopup="dialog"
      aria-label="Show keyboard shortcuts"
      aria-keyshortcuts="Shift+/"
      @click="open = true"
      @mouseenter="paused = true"
      @mouseleave="paused = false"
      @focus="paused = true"
      @blur="paused = false"
    >
      <UIcon name="i-lucide-keyboard" class="size-4 shrink-0 text-muted" />
      <span class="key-ticker-window" aria-hidden="true">
        <Transition name="tick" mode="out-in">
          <span :key="index % TICKER.length" class="key-ticker-row">
            <span class="flex items-center gap-1"><UKbd v-for="k in current.keys" :key="k" :value="k" size="sm" /></span>
            <span class="truncate text-sm text-toned">{{ current.action }}</span>
          </span>
        </Transition>
      </span>
    </button>
    <!-- narrower desktop windows: icon only -->
    <UButton class="hidden lg:inline-flex xl:hidden" size="sm" color="neutral" variant="outline" icon="i-lucide-keyboard" aria-haspopup="dialog" aria-label="Show keyboard shortcuts" @click="open = true" />
  </div>
</template>
