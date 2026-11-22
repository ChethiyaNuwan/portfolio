<script setup lang="ts">
// Expands a gallery image out of its tile into a large view, and collapses it back into the tile.
// Closes on the close button, a click outside the image, or Escape. Left/right arrows browse the images.
interface Item {
  id: string;
  image: string;
  caption: string;
  tags: string[];
}
const props = defineProps<{ items: Item[] }>();

const TRANSITION = "left .55s cubic-bezier(.2,.8,.1,1), top .55s cubic-bezier(.2,.8,.1,1), width .55s cubic-bezier(.2,.8,.1,1), height .55s cubic-bezier(.2,.8,.1,1)";
const index = ref<number | null>(null);
const shown = ref(false);
const box = ref<Record<string, string>>({});
const closeBtn = ref<{ $el?: HTMLElement } | null>(null);

let returnFocus: HTMLElement | null = null;
let closing: ReturnType<typeof setTimeout> | undefined;

const captionTop = computed(() => parseFloat(box.value.top ?? "0") + parseFloat(box.value.height ?? "0") + 14);
const current = computed(() => (index.value === null ? null : (props.items[index.value] ?? null)));
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const px = (r: { left: number; top: number; width: number; height: number }, transition: string) => ({
  left: `${r.left}px`,
  top: `${r.top}px`,
  width: `${r.width}px`,
  height: `${r.height}px`,
  transition,
});

function tileRect(id: string) {
  return document.querySelector(`[data-gallery-id="${CSS.escape(id)}"]`)?.getBoundingClientRect() ?? null;
}

function naturalSize(src: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth || 4, h: img.naturalHeight || 3 });
    img.onerror = () => resolve({ w: 4, h: 3 });
    img.src = src;
  });
}

// Largest size that fits the screen (leaving room for the caption) at the image's own proportions, centred.
function fit(n: { w: number; h: number }) {
  const maxW = window.innerWidth * 0.88;
  const maxH = window.innerHeight * 0.74;
  const scale = Math.min(maxW / n.w, maxH / n.h);
  const width = Math.round(n.w * scale);
  const height = Math.round(n.h * scale);
  return { left: Math.round((window.innerWidth - width) / 2), top: Math.round((window.innerHeight - height) / 2 - 24), width, height };
}

async function open(i: number, trigger?: HTMLElement | null) {
  const item = props.items[i];
  if (!item) return;
  clearTimeout(closing);
  returnFocus = trigger ?? (document.activeElement as HTMLElement | null);
  index.value = i;
  const target = fit(await naturalSize(item.image));
  const from = trigger?.getBoundingClientRect() ?? tileRect(item.id);
  document.documentElement.style.overflow = "hidden";

  if (from && !reduced()) {
    box.value = px(from, "none");
    await nextTick();
    void document.body.offsetHeight; // commit the start rectangle before animating
    requestAnimationFrame(() => {
      box.value = px(target, TRANSITION);
      shown.value = true;
    });
  } else {
    box.value = px(target, "none");
    shown.value = true;
  }
  await nextTick();
  (closeBtn.value?.$el ?? (closeBtn.value as unknown as HTMLElement | null))?.focus?.();
}

function finish() {
  index.value = null;
  document.documentElement.style.overflow = "";
  returnFocus?.focus?.();
}

function close() {
  const item = current.value;
  if (!item) return;
  const from = tileRect(item.id);
  shown.value = false;
  if (from && !reduced()) {
    box.value = px(from, TRANSITION);
    closing = setTimeout(finish, 560);
  } else {
    finish();
  }
}

async function go(d: 1 | -1) {
  if (index.value === null || props.items.length < 2) return;
  const next = (index.value + d + props.items.length) % props.items.length;
  const item = props.items[next]!;
  const target = fit(await naturalSize(item.image));
  index.value = next;
  box.value = px(target, reduced() ? "none" : TRANSITION);
}

function onKey(e: KeyboardEvent) {
  if (index.value === null) return;
  if (e.key === "Escape") close();
  else if (e.key === "ArrowRight") (e.preventDefault(), go(1));
  else if (e.key === "ArrowLeft") (e.preventDefault(), go(-1));
}

async function onResize() {
  const item = current.value;
  if (item && shown.value) box.value = px(fit(await naturalSize(item.image)), "none");
}

onMounted(() => {
  window.addEventListener("keydown", onKey);
  window.addEventListener("resize", onResize);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  window.removeEventListener("resize", onResize);
  clearTimeout(closing);
  document.documentElement.style.overflow = "";
});

defineExpose({ open });
</script>

<template>
  <Teleport to="body">
    <div
      v-if="current"
      class="fixed inset-0 z-[90] bg-black/85 backdrop-blur-sm transition-opacity duration-500"
      :class="shown ? 'opacity-100' : 'opacity-0'"
      role="dialog"
      aria-modal="true"
      :aria-label="current.caption || 'Gallery image'"
      @click.self="close"
    >
      <div class="absolute overflow-hidden border border-white/20 bg-black shadow-2xl" :style="box">
        <img :src="current.image" :alt="current.caption" class="size-full object-cover" />
      </div>

      <div
        v-if="box.top"
        class="pointer-events-none absolute inset-x-0 flex flex-col items-center gap-2 px-6 text-center transition-opacity duration-500"
        :class="shown ? 'opacity-100 delay-300' : 'opacity-0'"
        :style="{ top: `${captionTop}px` }"
      >
        <p v-if="current.caption" class="font-display text-xl font-medium text-white">{{ current.caption }}</p>
        <div v-if="current.tags.length" class="flex flex-wrap justify-center gap-2">
          <span v-for="t in current.tags" :key="t" class="border border-white/30 px-2 py-0.5 text-xs text-white/80">{{ t }}</span>
        </div>
      </div>

      <UButton ref="closeBtn" class="absolute right-4 top-4" icon="i-lucide-x" color="neutral" variant="solid" size="lg" aria-label="Close image" @click="close" />
      <template v-if="items.length > 1">
        <UButton class="absolute left-4 top-1/2 -translate-y-1/2" icon="i-lucide-chevron-left" color="neutral" variant="solid" size="lg" aria-label="Previous image" @click="go(-1)" />
        <UButton class="absolute right-4 top-1/2 -translate-y-1/2" icon="i-lucide-chevron-right" color="neutral" variant="solid" size="lg" aria-label="Next image" @click="go(1)" />
      </template>
    </div>
  </Teleport>
</template>
