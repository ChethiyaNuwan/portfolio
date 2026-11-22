<script setup lang="ts">
// Command palette (Cmd/Ctrl + K, or "/"): jump to any section or page, or run a quick action.
import { KEYMAP, isMac, matchesAny } from "~/utils/keybindings";
import { socialIconMap } from "~/utils/icons";

const open = ref(false);
const search = ref("");
const content = await useContent();
const route = useRoute();
const colorMode = useColorMode();
const { panels } = useStageState();

const PAGES = [
  { label: "Home", to: "/", icon: "i-lucide-house" },
  { label: "Work", to: "/work", icon: "i-lucide-briefcase" },
  { label: "Gallery", to: "/gallery", icon: "i-lucide-images" },
  { label: "Services", to: "/services", icon: "i-lucide-layers" },
  { label: "Contact", to: "/contact", icon: "i-lucide-mail" },
];

const run = (fn: () => void) => () => {
  open.value = false;
  setTimeout(fn, 120);
};

const groups = computed(() => {
  const list: { id: string; label: string; items: Record<string, unknown>[] }[] = [];
  if (route.path === "/" && panels.value.length) {
    list.push({
      id: "sections",
      label: "Sections on this page",
      items: panels.value.map((p, i) => ({
        label: p.label,
        icon: "i-lucide-panel-left-open",
        kbds: i < 9 ? ["alt", String(i + 1)] : undefined,
        onSelect: run(() => stageJump(p.id)),
      })),
    });
  }
  list.push({
    id: "pages",
    label: "Pages",
    items: PAGES.map((p) => ({ label: p.label, icon: p.icon, onSelect: run(() => navigateTo(p.to)) })),
  });
  list.push({
    id: "actions",
    label: "Actions",
    items: [
      { label: "Toggle light / dark theme", icon: "i-lucide-sun-moon", onSelect: run(() => (colorMode.preference = colorMode.value === "dark" ? "light" : "dark")) },
      { label: "Download CV", icon: "i-lucide-file-text", onSelect: run(() => window.open("/cv", "_blank")) },
      { label: "Email me", icon: "i-lucide-mail", suffix: content.value.profile.email, onSelect: run(() => (window.location.href = `mailto:${content.value.profile.email}`)) },
      ...content.value.socials.map((s) => ({ label: s.title, icon: socialIconMap[s.icon], onSelect: run(() => window.open(s.link, "_blank", "noopener")) })),
    ],
  });
  return list;
});

function onKey(e: KeyboardEvent) {
  const el = e.target instanceof HTMLElement ? e.target : null;
  const typing = !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  if (!matchesAny(e, KEYMAP.palette, isMac())) return;
  if (e.key === "/" && (typing || open.value)) return; // "/" only opens it; never steals typing
  e.preventDefault();
  open.value = !open.value;
}

onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
watch(open, (v) => !v && (search.value = ""));

defineExpose({ open: () => (open.value = true) });
</script>

<template>
  <UModal v-model:open="open" title="Go to" description="Search sections, pages and actions" :ui="{ content: 'max-w-xl' }">
    <template #content>
      <UCommandPalette v-model:search-term="search" :groups="groups as never" placeholder="Go to a section, page or action…" class="h-96" :close="{ onClick: () => (open = false) }" />
    </template>
  </UModal>
</template>
