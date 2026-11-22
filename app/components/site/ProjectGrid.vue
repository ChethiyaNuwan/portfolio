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
</script>

<template>
  <div>
    <ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="p in projects" :key="p.id">
        <button
          type="button"
          class="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-default bg-elevated/40 text-left transition-colors hover:border-accented focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
          </span>
        </button>
      </li>
    </ul>

    <UModal v-model:open="isOpen" :title="current?.title ?? 'Project'" :description="current ? `${current.type} · ${current.pages} pages` : ''" :ui="{ content: 'max-w-3xl' }">
      <template #body>
        <div v-if="current" class="flex flex-col gap-5">
          <img :src="shown" :alt="`Screenshot of ${current.title}`" class="w-full rounded-lg border border-default object-cover object-top" />
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
