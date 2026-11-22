<script setup lang="ts">
import type { FieldDef } from "../../utils/adminFields";

const props = defineProps<{ def: FieldDef }>();
const model = defineModel<unknown>();

const tags = computed({
  get: () => (Array.isArray(model.value) ? (model.value as string[]).join(", ") : ""),
  set: (v: string) => {
    model.value = v.split(",").map((s) => s.trim()).filter(Boolean);
  },
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
  <label class="flex flex-col gap-1">
    <span class="text-sm text-light-gray-2">{{ props.def.label }}</span>
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
