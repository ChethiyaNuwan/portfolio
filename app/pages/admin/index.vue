<script setup lang="ts">
import { sectionConfigs, sectionOrder } from "../../utils/adminFields";

definePageMeta({ layout: "admin", middleware: "admin" });

const { logout } = useAdminApi();
const active = ref<string>("profile");
const tabs = [...sectionOrder.map((k) => ({ key: k, label: sectionConfigs[k]!.label })), { key: "cv", label: "CV" }, { key: "security", label: "Security" }];
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-6 p-6 lg:flex-row">
    <aside class="lg:w-56 lg:shrink-0">
      <div class="mb-4 flex items-center justify-between lg:block">
        <h1 class="text-xl font-bold">Portfolio admin</h1>
        <div class="flex gap-2 lg:mt-3">
          <a href="/" target="_blank" class="admin-btn">View site</a>
          <button class="admin-btn" @click="logout">Log out</button>
        </div>
      </div>
      <nav class="flex gap-2 overflow-x-auto lg:flex-col">
        <button
          v-for="t in tabs"
          :key="t.key"
          :class="['rounded-lg px-3 py-2 text-left whitespace-nowrap transition-colors', active === t.key ? 'bg-elevated text-highlighted border border-default' : 'text-muted hover:bg-muted']"
          @click="active = t.key"
        >
          {{ t.label }}
        </button>
      </nav>
    </aside>
    <main class="min-w-0 flex-1">
      <CvPanel v-if="active === 'cv'" />
      <PasskeyPanel v-else-if="active === 'security'" />
      <SectionEditor v-else :key="active" :section="active" />
    </main>
  </div>
</template>
