<script setup lang="ts">
const content = await useContent();
const projects = computed(() => content.value.projects);
const externalUrl = (link: string) => (/^https?:\/\//.test(link) ? link : `https://${link}`);

const openId = ref<string | null>(null);
const isOpen = computed({
  get: () => openId.value !== null,
  set: (v: boolean) => {
    if (!v) openId.value = null;
  },
});
const current = computed(() => projects.value.find((p) => p.id === openId.value) ?? null);
const shown = ref<string>("");
watch(current, (p) => (shown.value = p?.image ?? ""));

// Spotlight loop: one card at a time comes out of the screen while the rest dims, then the next one. Pointing at the
// grid, focusing a card or opening a project stops it. Only cards that are on screen take their turn.
const grid = ref<HTMLElement>();
const cardEls = () => [...(grid.value?.querySelectorAll<HTMLElement>(":scope > li > .proj-card") ?? [])];
function onScreen(i: number) {
  const el = cardEls()[i];
  if (!el) return false;
  const r = el.getBoundingClientRect();
  const h = Math.min(r.height, window.innerHeight);
  const visible = Math.min(r.bottom, window.innerHeight - 70) - Math.max(r.top, 0);
  return visible > h * 0.6 && r.left >= -4 && r.right <= window.innerWidth + 4;
}
const { active, bind, pause, resume } = useCycle(grid, () => projects.value.length, { interval: 4600, eligible: onScreen, startDelay: 1800 });
watch(isOpen, (open) => (open ? pause() : resume()));

// the project currently coming out, and the grid card it grows from
const spot = ref<{ project: (typeof projects.value)[number]; rect: DOMRect } | null>(null);
watch(active, (a) => {
  const el = a >= 0 ? cardEls()[a] : undefined;
  spot.value = el && projects.value[a] ? { project: projects.value[a]!, rect: el.getBoundingClientRect() } : null;
});

</script>

<template>
  <div>
    <ul ref="grid" class="proj-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3" :class="{ 'has-spot': active >= 0 }" v-bind="bind">
      <li v-for="(p, i) in projects" :key="p.id">
        <button
          type="button"
          class="proj-card group flex h-full w-full flex-col overflow-hidden border border-default bg-muted/40 text-left hover:border-accented focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :class="{ 'is-spot': active === i }"
          @click="openId = p.id"
        >
          <span class="block aspect-[16/10] overflow-hidden bg-muted">
            <img :src="p.image" :alt="`Screenshot of ${p.title}`" loading="lazy" class="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none" />
          </span>
          <span class="flex flex-1 flex-col gap-3 p-5">
            <span class="flex flex-wrap gap-2">
              <UBadge v-for="t in p.tags" :key="t" :label="t" color="neutral" variant="subtle" />
            </span>
            <span class="text-xl font-semibold text-highlighted">{{ p.title }}</span>
            <span class="line-clamp-3 text-muted">{{ p.description }}</span>
            <StackChips v-if="p.stack?.length" :ids="p.stack" />
            <span class="mt-auto inline-flex min-w-0 items-center gap-1.5 pt-1 text-sm font-medium text-primary">
              <UIcon name="i-lucide-arrow-up-right" class="size-4 shrink-0" aria-hidden="true" />
              <span class="truncate underline decoration-primary/40 underline-offset-4 group-hover:decoration-primary">{{ p.link.replace(/^https?:\/\//, "") }}</span>
            </span>
          </span>
        </button>
      </li>
    </ul>

    <ProjectSpotlight :state="spot" @hold="pause" @release="resume" @open="openId = $event" />

    <UModal v-model:open="isOpen" :title="current?.title ?? 'Project'" :description="current ? `${current.type} · ${current.pages} pages` : ''" :ui="{ content: 'max-w-3xl' }">
      <template #body>
        <div v-if="current" class="flex flex-col gap-5">
          <img :src="shown" :alt="`Screenshot of ${current.title}`" class="w-full border border-default object-cover object-top" />
          <div v-if="current.gallery.length" class="flex flex-wrap gap-2">
            <button
              v-for="img in [current.image, ...current.gallery]"
              :key="img"
              type="button"
              class="size-16 overflow-hidden rounded-md border-2"
              :class="shown === img ? 'border-primary' : 'border-default'"
              :aria-label="'Show image'"
              @click="shown = img"
            >
              <img :src="img" alt="" class="size-full object-cover" />
            </button>
          </div>
          <p class="leading-relaxed text-muted">{{ current.description }}</p>
          <StackChips v-if="current.stack?.length" :ids="current.stack" size="md" />
          <div class="flex flex-wrap items-center gap-2">
            <UBadge v-for="t in current.tags" :key="t" :label="t" color="neutral" variant="subtle" />
            <UBadge :label="`${current.theme} theme`" color="neutral" variant="outline" />
          </div>
          <div>
            <UButton :to="externalUrl(current.link)" target="_blank" rel="noopener noreferrer" trailing-icon="i-lucide-arrow-up-right" :label="`Visit ${current.link}`" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
