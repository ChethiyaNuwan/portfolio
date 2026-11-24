<script setup lang="ts">
// A project coming out of the screen: it grows from its card in the grid into a wide panel while everything behind
// it dims, and the stack it was built with and its other images pop in as small boxes on the right.
const props = defineProps<{ state: { project: Project; rect: DOMRect } | null }>();
const emit = defineEmits<{ hold: []; release: []; open: [id: string] }>();

type Project = {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  tags: string[];
  gallery: string[];
  stack?: string[];
};

const content = await useContent();
const stackItems = computed(() => (props.state?.project.stack ?? []).map((id) => content.value.stack.find((s) => s.id === id)).filter((s): s is NonNullable<typeof s> => !!s));
const images = computed(() => (props.state?.project.gallery ?? []).filter(Boolean).slice(0, 6));
const shownLink = (l: string) => l.replace(/^https?:\/\//, "");

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const insetFrom = (c: DOMRect, r: DOMRect) => `inset(${c.top - r.top}px ${r.right - c.right}px ${r.bottom - c.bottom}px ${c.left - r.left}px)`;

function onEnter(root: Element, done: () => void) {
  const card = root.querySelector<HTMLElement>(".spot-card");
  const backdrop = root.querySelector<HTMLElement>(".spot-backdrop");
  if (!card || !props.state || reduced()) return done();
  const from = insetFrom(props.state.rect, card.getBoundingClientRect());
  backdrop?.animate({ opacity: [0, 1] }, { duration: 500, easing: "ease-out", fill: "both" });
  card.animate({ clipPath: [from, "inset(0px 0px 0px 0px)"], opacity: [0.4, 1] }, { duration: 750, easing: "cubic-bezier(0.2, 0.8, 0.1, 1)", fill: "both" });
  root.querySelectorAll<HTMLElement>(".spot-pop").forEach((el, i) =>
    el.animate({ opacity: [0, 1], transform: ["scale(0.5) translateY(14px)", "none"] }, { duration: 520, delay: 380 + i * 70, easing: "cubic-bezier(0.2, 0.9, 0.2, 1.2)", fill: "both" }),
  );
  root.querySelectorAll<HTMLElement>(".spot-fade").forEach((el, i) => el.animate({ opacity: [0, 1] }, { duration: 500, delay: 300 + i * 90, fill: "both" }));
  setTimeout(done, 800);
}

function onLeave(root: Element, done: () => void) {
  const card = root.querySelector<HTMLElement>(".spot-card");
  const backdrop = root.querySelector<HTMLElement>(".spot-backdrop");
  const rect = lastRect;
  if (!card || !rect || reduced()) return done();
  backdrop?.animate({ opacity: [1, 0] }, { duration: 450, easing: "ease-in", fill: "both" });
  const a = card.animate({ clipPath: ["inset(0px 0px 0px 0px)", insetFrom(rect, card.getBoundingClientRect())], opacity: [1, 0.2] }, { duration: 520, easing: "cubic-bezier(0.5, 0, 0.75, 0)", fill: "both" });
  a.onfinish = () => done();
}
// the grid card the panel grew from, remembered for the way back
let lastRect: DOMRect | null = null;
watch(() => props.state, (s) => s && (lastRect = s.rect), { immediate: true });
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition :css="false" @enter="onEnter" @leave="onLeave">
        <div v-if="state" :key="state.project.id" class="spot-root pointer-events-none fixed inset-x-0 top-0 z-[45] grid place-items-center p-3 sm:p-8" style="bottom: var(--footer-space)">
          <div class="spot-backdrop absolute inset-0 bg-black/75 backdrop-blur-[3px]" />
          <article
            class="spot-card pointer-events-auto relative grid max-h-full w-[min(100%,66rem)] cursor-pointer grid-rows-[auto_auto] overflow-hidden border border-highlighted bg-default shadow-[0_50px_120px_-30px_rgb(0_0_0/0.95)] md:grid-cols-[1.45fr_1fr] md:grid-rows-1"
            :aria-label="`${state.project.title}, highlighted project`"
            @pointerenter="emit('hold')"
            @pointerleave="emit('release')"
            @click="emit('open', state.project.id)"
          >
            <div class="flex min-h-0 flex-col">
              <img :src="state.project.image" :alt="`Screenshot of ${state.project.title}`" class="aspect-[16/9] w-full object-cover object-top" />
              <div class="spot-fade flex min-h-0 flex-col gap-2 p-4 sm:p-6">
                <div class="flex flex-wrap gap-2"><UBadge v-for="t in state.project.tags" :key="t" :label="t" color="neutral" variant="outline" /></div>
                <h3 class="font-display text-2xl font-semibold leading-tight text-highlighted sm:text-4xl">{{ state.project.title }}</h3>
                <p class="line-clamp-3 text-muted sm:text-lg">{{ state.project.description }}</p>
                <span class="inline-flex items-center gap-1.5 pt-1 font-medium text-primary"><UIcon name="i-lucide-arrow-up-right" class="size-4" aria-hidden="true" /><span class="truncate underline decoration-primary/40 underline-offset-4">{{ shownLink(state.project.link) }}</span></span>
              </div>
            </div>

            <div v-if="stackItems.length || images.length" class="flex min-h-0 flex-col gap-4 border-t border-default bg-muted/40 p-4 sm:p-5 md:border-l md:border-t-0">
              <div v-if="stackItems.length" class="flex flex-col gap-2">
                <p class="spot-fade text-xs font-medium uppercase tracking-widest text-muted">Built with</p>
                <ul class="grid grid-cols-4 gap-2 md:grid-cols-3" role="list">
                  <li v-for="s in stackItems" :key="s.id" class="spot-pop flex flex-col items-center gap-1 border border-default bg-default p-2 text-center">
                    <img :src="s.logo" alt="" class="size-6 object-contain" />
                    <span class="w-full truncate text-[0.65rem] text-muted">{{ s.title }}</span>
                  </li>
                </ul>
              </div>
              <div v-if="images.length" class="flex flex-col gap-2">
                <p class="spot-fade text-xs font-medium uppercase tracking-widest text-muted">More images</p>
                <ul class="grid grid-cols-3 gap-2" role="list">
                  <li v-for="(src, i) in images" :key="i" class="spot-pop aspect-[4/3] overflow-hidden border border-default bg-default">
                    <img :src="src" alt="" class="size-full object-cover object-top" loading="lazy" />
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>
