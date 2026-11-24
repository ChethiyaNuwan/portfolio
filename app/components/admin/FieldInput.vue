<script setup lang="ts">
import type { FieldDef } from "../../utils/adminFields";

const props = defineProps<{ def: FieldDef; item?: Record<string, any> }>();
const { upload } = useAdminApi();
const bulkBusy = ref(false);
const bulkError = ref("");
// pick several image files at once; each is uploaded and appended to the list
async function addMany(e: Event) {
  const input = e.target as HTMLInputElement;
  const files = [...(input.files ?? [])];
  input.value = "";
  if (!files.length) return;
  bulkBusy.value = true;
  bulkError.value = "";
  try {
    const urls: string[] = [];
    for (const f of files) urls.push(await upload(f, "image"));
    images.value = [...images.value.filter(Boolean), ...urls];
  } catch (err) {
    bulkError.value = errorMessage(err);
  } finally {
    bulkBusy.value = false;
  }
}
const model = defineModel<unknown>();

const tags = computed({
  get: () => (Array.isArray(model.value) ? (model.value as string[]).join(", ") : ""),
  set: (v: string) => {
    model.value = v.split(",").map((s) => s.trim()).filter(Boolean);
  },
});
const images = computed<string[]>({
  get: () => (Array.isArray(model.value) ? (model.value as string[]) : []),
  set: (v) => (model.value = v),
});
const asString = computed({
  get: () => (model.value as string) ?? "",
  set: (v: string) => (model.value = v),
});
const asBool = computed({
  get: () => model.value !== false,
  set: (v: boolean) => (model.value = v),
});
const asNumber = computed({
  get: () => (model.value as number) ?? 0,
  set: (v: number | string) => (model.value = Number(v) || 0),
});
</script>

<template>
  <div v-if="props.def.type === 'color'" class="flex flex-col gap-1">
    <span class="text-sm text-muted">{{ props.def.label }}</span>
    <div class="flex items-center gap-3">
      <input v-model="asString" type="color" class="size-11 cursor-pointer rounded border border-default bg-transparent p-0.5" :aria-label="props.def.label" />
      <input v-model="asString" type="text" class="admin-input max-w-40 font-mono" maxlength="7" placeholder="#6f8bff" />
      <span class="inline-block h-8 w-24 rounded" :style="{ backgroundColor: asString }" aria-hidden="true" />
    </div>
  </div>
  <PeriodField v-else-if="props.def.type === 'period' && props.item" :item="props.item as never" />
  <div v-else-if="props.def.type === 'stackpick'" class="flex flex-col gap-1">
    <span class="text-sm text-muted">{{ props.def.label }}</span>
    <StackPicker :model-value="(Array.isArray(model) ? model : []) as string[]" @update:model-value="model = $event" />
  </div>
  <div v-else-if="props.def.type === 'imagelist'" class="flex flex-col gap-2">
    <span class="text-sm text-muted">{{ props.def.label }}</span>
    <div v-for="(_, i) in images" :key="i" class="flex items-start gap-2">
      <div class="flex-1"><ImageField v-model="images[i]" /></div>
      <button type="button" class="admin-btn text-red-500" @click="images = images.filter((__, j) => j !== i)">Remove</button>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <label class="admin-btn w-max cursor-pointer" :class="bulkBusy && 'opacity-60'">
        {{ bulkBusy ? "Uploading…" : "Upload images (several at once)" }}
        <input type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/gif" multiple class="sr-only" :disabled="bulkBusy" @change="addMany" />
      </label>
      <button type="button" class="admin-btn w-max" @click="images = [...images, '']">+ Add by URL</button>
    </div>
    <p v-if="bulkError" class="text-sm text-red-500">{{ bulkError }}</p>
  </div>
  <label v-else-if="props.def.type === 'toggle'" class="flex items-center gap-3">
    <input v-model="asBool" type="checkbox" class="size-5 accent-[var(--ui-primary)]" />
    <span class="text-sm text-muted">{{ props.def.label }}</span>
  </label>
  <label v-else class="flex flex-col gap-1">
    <span class="text-sm text-muted">{{ props.def.label }}</span>
    <ImageField v-if="props.def.type === 'image'" v-model="asString" />
    <textarea v-else-if="props.def.type === 'textarea'" v-model="asString" rows="5" class="admin-input" />
    <input v-else-if="props.def.type === 'number'" v-model="asNumber" type="number" min="0" class="admin-input" />
    <input v-else-if="props.def.type === 'tags'" v-model="tags" type="text" class="admin-input" placeholder="comma, separated" />
    <select v-else-if="props.def.type === 'select'" v-model="asString" class="admin-input">
      <option v-for="o in props.def.options" :key="o" :value="o">{{ o }}</option>
    </select>
    <input v-else v-model="asString" type="text" class="admin-input" />
  </label>
</template>
