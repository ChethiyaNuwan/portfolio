<script setup lang="ts">
import { blankItem, sectionConfigs } from "../../utils/adminFields";

const props = defineProps<{ section: string }>();
const { api } = useAdminApi();

const config = computed(() => sectionConfigs[props.section]!);
const data = ref<any>(null);
const loading = ref(true);
const saving = ref(false);
const error = ref("");
const saved = ref(false);

async function load() {
  loading.value = true;
  error.value = "";
  saved.value = false;
  try {
    const all = await api<Record<string, unknown>>("/api/admin/content");
    data.value = JSON.parse(JSON.stringify(all[props.section]));
  } catch (err) {
    error.value = errorMessage(err);
  } finally {
    loading.value = false;
  }
}
watch(() => props.section, load, { immediate: true });

async function save() {
  saving.value = true;
  error.value = "";
  saved.value = false;
  try {
    data.value = await api(`/api/admin/content/${props.section}`, { method: "PUT", body: data.value });
    saved.value = true;
  } catch (err) {
    error.value = errorMessage(err);
  } finally {
    saving.value = false;
  }
}

const add = () => data.value.push(blankItem(props.section));
const remove = (i: number) => {
  if (confirm("Delete this item?")) data.value.splice(i, 1);
};
const move = (i: number, d: -1 | 1) => {
  const j = i + d;
  if (j < 0 || j >= data.value.length) return;
  [data.value[i], data.value[j]] = [data.value[j], data.value[i]];
};
const heading = (item: Record<string, unknown>, i: number) => String(item[config.value.itemLabel ?? "title"] || `Item ${i + 1}`);
</script>

<template>
  <section class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">{{ config.label }}</h2>
      <button class="admin-btn-primary" :disabled="saving || loading" @click="save">{{ saving ? "Saving…" : "Save changes" }}</button>
    </div>

    <p v-if="loading" class="text-light-gray-2">Loading…</p>
    <p v-if="error" class="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400 whitespace-pre-line">{{ error }}</p>
    <p v-if="saved" class="rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-400">Saved. The public site is updated.</p>

    <template v-if="data && !loading">
      <div v-if="config.kind === 'object'" class="grid gap-4">
        <FieldInput v-for="f in config.fields" :key="f.key" v-model="data[f.key]" :def="f" />
      </div>

      <template v-else>
        <div v-for="(item, i) in (data as Record<string, any>[])" :key="item.id" class="rounded-xl border border-dark-gray-3 bg-very-dark-gray p-5 grid gap-4">
          <div class="flex items-center justify-between gap-3">
            <h3 class="font-semibold text-light-gray-4">{{ heading(item, i) }}</h3>
            <div class="flex gap-2">
              <button class="admin-btn" :disabled="i === 0" @click="move(i, -1)">↑</button>
              <button class="admin-btn" :disabled="i === data.length - 1" @click="move(i, 1)">↓</button>
              <button class="admin-btn text-red-400" @click="remove(i)">Delete</button>
            </div>
          </div>
          <FieldInput v-for="f in config.fields" :key="f.key" v-model="item[f.key]" :def="f" />
        </div>
        <button class="admin-btn w-max" @click="add">+ Add item</button>
      </template>
    </template>
  </section>
</template>
