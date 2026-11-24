<script setup lang="ts">
defineOptions({ inheritAttrs: false });
// Light / dark switch. The new theme spreads out as a circle from the button (View Transitions API); browsers
// without it, and visitors who prefer reduced motion, just switch.
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");
const btn = ref<{ $el: HTMLElement } | HTMLElement>();

async function toggle() {
  const next = isDark.value ? "light" : "dark";
  const el = (btn.value as { $el?: HTMLElement })?.$el ?? (btn.value as HTMLElement | undefined);
  const doc = document as Document & { startViewTransition?: (cb: () => Promise<void> | void) => { ready: Promise<void> } };
  if (!el || !doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    colorMode.preference = next;
    return;
  }
  const r = el.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const t = doc.startViewTransition(async () => {
    colorMode.preference = next;
    await nextTick();
  });
  await t.ready.catch(() => {});
  document.documentElement.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
    { duration: 650, easing: "cubic-bezier(0.2, 0.8, 0.1, 1)", pseudoElement: "::view-transition-new(root)" },
  );
}

defineExpose({ toggle });
</script>

<template>
  <ClientOnly>
    <UButton ref="btn" v-bind="$attrs" color="neutral" variant="outline" size="sm" :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'" @click="toggle" />
    <template #fallback>
      <UButton v-bind="$attrs" color="neutral" variant="outline" size="sm" icon="i-lucide-sun-moon" aria-label="Switch colour mode" disabled />
    </template>
  </ClientOnly>
</template>
