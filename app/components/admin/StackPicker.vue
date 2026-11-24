<script setup lang="ts">
// Pick which of your stack items a project is built with (the stack list is edited under Stack).
const model = defineModel<string[]>({ default: () => [] });
const { api } = useAdminApi();

interface StackItem {
  id: string;
  title: string;
  logo: string;
}
const options = ref<StackItem[]>([]);
onMounted(async () => {
  const all = await api<{ stack: StackItem[] }>("/api/admin/content");
  options.value = all.stack;
});

const selected = computed(() => new Set(model.value));
function toggle(id: string) {
  model.value = selected.value.has(id) ? model.value.filter((x) => x !== id) : [...model.value, id];
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <p v-if="!options.length" class="text-sm text-muted">No stack items yet. Add some under Stack first.</p>
    <ul v-else class="flex flex-wrap gap-2" role="group" aria-label="Built with">
      <li v-for="o in options" :key="o.id">
        <button type="button" class="flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm transition-colors" :class="selected.has(o.id) ? 'border-primary bg-primary/15 text-highlighted' : 'border-default text-muted hover:bg-muted'" :aria-pressed="selected.has(o.id)" @click="toggle(o.id)">
          <img :src="o.logo" alt="" class="size-4 object-contain" />
          {{ o.title }}
        </button>
      </li>
    </ul>
  </div>
</template>
