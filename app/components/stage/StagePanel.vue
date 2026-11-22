<script setup lang="ts">
// One full-screen section. A real <section>, always in reading order in the DOM. When its content is taller than the
// screen it scrolls vertically by itself, with a fade and chevron hinting that there is more below.
defineProps<{ id: string; label: string }>();

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
    <div ref="scroll" class="stage-panel-scroll" :tabindex="more ? 0 : undefined" @scroll.passive="update">
      <slot />
    </div>
    <div v-show="more" class="stage-more" aria-hidden="true">
      <UIcon name="i-lucide-chevrons-down" class="size-6 animate-bounce motion-reduce:animate-none" />
    </div>
  </section>
</template>
