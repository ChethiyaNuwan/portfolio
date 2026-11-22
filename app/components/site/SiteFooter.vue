<script setup lang="ts">
import { navItems, socialIconMap } from "~/utils/icons";

// Always-visible bar: the progress line and section navigation on the home page, page links elsewhere,
// plus the theme toggle and contact button.
const content = await useContent();
const route = useRoute();
const { panels, activeId, progress, horizontal, tickCount } = useStageState();

const sectionMode = computed(() => route.path === "/" && panels.value.length > 0);

function goSection(e: MouseEvent, id: string) {
  if (!horizontal.value) return; // vertical layout: plain in-page anchor
  e.preventDefault();
  stageJump(id);
}
</script>

<template>
  <footer class="site-footer fixed inset-x-0 bottom-0 z-50 border-t border-default bg-default/85 backdrop-blur-md">
    <div class="absolute inset-x-0 top-0 h-[2px]" aria-hidden="true">
      <div v-if="sectionMode && horizontal" :key="tickCount" class="tick-line origin-left bg-primary" :style="{ transform: `scaleX(${progress})` }" />
    </div>

    <div class="mx-auto grid h-[var(--footer-h)] max-w-[120rem] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
      <!-- left: name and social links -->
      <div class="flex items-center gap-2">
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
      <nav v-if="sectionMode" class="min-w-0 overflow-x-auto" aria-label="Sections on this page">
        <ul class="flex items-center justify-start gap-x-5 whitespace-nowrap lg:justify-center">
          <li v-for="p in panels" :key="p.id">
            <a
              :href="`#${p.id}`"
              class="text-sm transition-colors"
              :class="activeId === p.id ? 'text-highlighted' : 'text-muted hover:text-highlighted'"
              :aria-current="activeId === p.id ? 'true' : undefined"
              @click="goSection($event, p.id)"
            >
              {{ p.label }}
            </a>
          </li>
        </ul>
      </nav>
      <nav v-else class="min-w-0 overflow-x-auto" aria-label="Primary">
        <ul class="flex items-center justify-start gap-x-5 whitespace-nowrap lg:justify-center">
          <li v-for="item in navItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="text-sm transition-colors"
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
        <UButton :href="`mailto:${content.profile.email}`" icon="i-lucide-mail" label="Get in touch" size="sm" class="hidden sm:inline-flex" />
        <UButton :href="`mailto:${content.profile.email}`" icon="i-lucide-mail" aria-label="Get in touch" size="sm" class="sm:hidden" />
        <UColorModeButton size="sm" />
      </div>
    </div>
  </footer>
</template>
