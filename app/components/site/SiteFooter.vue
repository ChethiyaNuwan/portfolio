<script setup lang="ts">
import { navItems, socialIconMap } from "~/utils/icons";
import { tickHaptic } from "~/utils/haptics";

// Always-visible bar: the progress line and section navigation on the home page, page links elsewhere,
// plus the theme toggle and contact button.
const content = await useContent();
const route = useRoute();
const { panels, activeId, progress, mode, tickCount } = useStageState();

const navEl = ref<HTMLElement>();

// On narrow screens the link row scrolls: keep the active link centred so it is never off-screen.
watch([activeId, () => route.path], async () => {
  await nextTick();
  const nav = navEl.value;
  const a = nav?.querySelector<HTMLElement>("[aria-current]");
  if (nav && a && nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.offsetWidth / 2, behavior: "smooth" });
});

const activeIndex = computed(() => panels.value.findIndex((p) => p.id === activeId.value));
function step(dir: 1 | -1) {
  const t = panels.value[activeIndex.value + dir];
  if (t) stageJump(t.id);
}

// Phones: drag along the dots to move through the sections, one tick (and one vibration) per step
const SWIPE_STEP = 38;
let swipe: { x: number; id: number; at: number } | null = null;
let swiped = false;
function onSwipeDown(e: PointerEvent) {
  swipe = { x: e.clientX, id: e.pointerId, at: Math.max(0, activeIndex.value) };
  swiped = false;
}
function onSwipeMove(e: PointerEvent) {
  if (!swipe || e.pointerId !== swipe.id) return;
  const dx = e.clientX - swipe.x;
  if (Math.abs(dx) < SWIPE_STEP) return;
  const dir = dx < 0 ? 1 : -1;
  swipe.x = e.clientX;
  swiped = true;
  const t = panels.value[swipe.at + dir]; // the section the swipe has reached, not the one still scrolling into view
  if (t) {
    swipe.at += dir;
    stageJump(t.id);
    tickHaptic("tick");
  } else tickHaptic("bump");
}
function onSwipeEnd() {
  swipe = null;
}
function onSwipeClick(e: MouseEvent) {
  if (swiped) {
    e.preventDefault();
    e.stopPropagation();
    swiped = false;
  }
}

const sectionMode = computed(() => route.path === "/" && panels.value.length > 0);

function goSection(e: MouseEvent, id: string) {
  if (mode.value === "page") return; // plain vertical page: normal in-page anchor
  e.preventDefault();
  stageJump(id);
}
</script>

<template>
  <footer class="site-footer fixed inset-x-0 bottom-0 z-50 border-t border-default bg-default/85 backdrop-blur-md" style="padding-bottom: env(safe-area-inset-bottom, 0px)">
    <div class="absolute inset-x-0 top-0 h-[2px]" aria-hidden="true">
      <div v-if="sectionMode && mode !== 'page'" :key="tickCount" class="tick-line origin-left bg-primary" :style="{ transform: `scaleX(${progress})` }" />
    </div>

    <div class="mx-auto grid h-[var(--footer-h)] max-w-[120rem] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1 px-2 sm:px-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-3 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
      <!-- left: name and social links -->
      <div class="flex items-center gap-2">
        <UColorModeButton size="sm" class="tap md:hidden" />
        <NuxtLink to="/" class="hidden shrink-0 font-display text-base font-semibold tracking-tight text-highlighted md:block">
          {{ content.profile.name }}
        </NuxtLink>
        <div class="flex items-center">
          <UTooltip v-for="s in content.socials" :key="s.id" :text="s.title" :content="{ side: 'top', sideOffset: 8 }">
            <UButton
              :to="s.link"
              target="_blank"
              rel="noopener noreferrer"
              :icon="socialIconMap[s.icon]"
              :aria-label="s.title"
              color="neutral"
              variant="ghost"
              size="sm"
              class="footer-social hidden sm:inline-flex"
            />
          </UTooltip>
        </div>
      </div>

      <!-- centre: sections of the page (home) or pages of the site (elsewhere) -->
      <!-- phones: previous / current section / next, with a dot per section instead of a scrolling link row -->
      <div v-if="sectionMode && mode !== 'page'" class="flex min-w-0 touch-none select-none items-center justify-between md:hidden" @pointerdown="onSwipeDown" @pointermove="onSwipeMove" @pointerup="onSwipeEnd" @pointercancel="onSwipeEnd" @click.capture="onSwipeClick">
        <UButton icon="i-lucide-chevron-left" color="neutral" variant="ghost" size="sm" class="tap shrink-0" aria-label="Previous section" :disabled="activeIndex <= 0" @click="step(-1)" />
        <ul class="flex min-w-0 items-center justify-center">
          <li v-for="p in panels" :key="p.id" class="flex">
            <a :href="`#${p.id}`" class="flex h-11 items-center justify-center transition-all duration-300" :class="activeId === p.id ? 'px-2' : 'w-4'" :aria-label="p.label" :aria-current="activeId === p.id ? 'true' : undefined" @click="goSection($event, p.id)">
              <span v-if="activeId === p.id" class="whitespace-nowrap text-sm font-medium text-highlighted" aria-live="polite">{{ p.label }}</span>
              <span v-else class="block size-1 rounded-full bg-[var(--ui-border-accented)]" />
            </a>
          </li>
        </ul>
        <UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" size="sm" class="tap shrink-0" aria-label="Next section" :disabled="activeIndex >= panels.length - 1" @click="step(1)" />
      </div>
      <nav v-if="sectionMode" ref="navEl" class="footer-nav min-w-0 overflow-x-auto px-3 py-2" :class="mode !== 'page' && 'max-md:hidden'" aria-label="Sections on this page">
        <ul class="footer-nav-list flex items-center justify-start gap-x-5 whitespace-nowrap lg:justify-center">
          <li v-for="p in panels" :key="p.id">
            <a
              :href="`#${p.id}`"
              class="footer-link text-sm"
              :class="activeId === p.id ? 'text-highlighted' : 'text-muted hover:text-highlighted'"
              :aria-current="activeId === p.id ? 'true' : undefined"
              @click="goSection($event, p.id)"
            >
              {{ p.label }}
            </a>
          </li>
        </ul>
      </nav>
      <nav v-else ref="navEl" class="footer-nav min-w-0 overflow-x-auto px-3 py-2" aria-label="Primary">
        <ul class="footer-nav-list flex items-center justify-start gap-x-5 whitespace-nowrap lg:justify-center">
          <li v-for="item in navItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="footer-link text-sm"
              :class="route.path === item.to ? 'text-highlighted' : 'text-muted hover:text-highlighted'"
              :aria-current="route.path === item.to ? 'page' : undefined"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- right: contact and theme -->
      <div class="flex items-center justify-end gap-1">
        <div class="mr-3"><KeybindingTicker /></div>
        <UButton :href="`mailto:${content.profile.email}`" icon="i-lucide-mail" label="Get in touch" size="sm" class="tap hidden sm:inline-flex" />
        <UButton :href="`mailto:${content.profile.email}`" icon="i-lucide-mail" aria-label="Get in touch" size="sm" class="tap sm:hidden" />
        <UColorModeButton size="sm" class="tap max-md:hidden" />
      </div>
    </div>
  </footer>
</template>
