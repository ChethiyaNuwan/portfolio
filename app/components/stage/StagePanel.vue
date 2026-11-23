<script setup lang="ts">
// One full-screen section. A real <section>, always in reading order in the DOM. When its content is taller than the
// screen it scrolls vertically by itself (unless it is marked "fit", like the home section).
defineProps<{ id: string; label: string; fit?: boolean }>();

const scroll = ref<HTMLElement>();
const more = ref(false);
let ro: ResizeObserver | undefined;

function update() {
  const el = scroll.value;
  if (!el) return;
  more.value = el.scrollHeight - el.clientHeight - el.scrollTop > 24;
}

onMounted(() => {
  update();
  ro = new ResizeObserver(update);
  if (scroll.value) {
    ro.observe(scroll.value);
    for (const child of Array.from(scroll.value.children)) ro.observe(child);
  }
});
onBeforeUnmount(() => ro?.disconnect());
</script>

<template>
  <section :id="id" :aria-labelledby="`${id}-heading`" data-stage-panel :data-label="label" class="stage-panel relative">
    <div ref="scroll" class="stage-panel-scroll" :class="{ 'stage-fit': fit }" :tabindex="more && !fit ? 0 : undefined" @scroll.passive="update">
      <slot />
    </div>
    <!-- phones: tells the visitor this section continues below -->
    <div class="stage-more pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-8 items-end justify-center md:hidden" :class="{ 'is-on': more && !fit }" aria-hidden="true">
      <UIcon name="i-lucide-chevrons-down" class="stage-more-icon size-6 text-primary" />
    </div>
  </section>
</template>
