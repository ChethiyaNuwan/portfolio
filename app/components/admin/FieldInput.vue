<script setup lang="ts">
import type { FieldDef } from "../../utils/adminFields";

const props = defineProps<{ def: FieldDef; item?: Record<string, any> }>();
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
const asNumber = computed({
  get: () => (model.value as number) ?? 0,
  set: (v: number | string) => (model.value = Number(v) || 0),
});
</script>

<template>
  <PeriodField v-if="props.def.type === 'period' && props.item" :item="props.item as never" />
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
    <button type="button" class="admin-btn w-max" @click="images = [...images, '']">+ Add image</button>
  </div>
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
