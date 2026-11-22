<script setup lang="ts">
const model = defineModel<string>({ default: "" });
const { upload } = useAdminApi();
const busy = ref(false);
const error = ref("");

async function onPick(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  busy.value = true;
  error.value = "";
  try {
    model.value = await upload(file, "image");
  } catch (err) {
    error.value = errorMessage(err);
  } finally {
    busy.value = false;
    input.value = "";
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-3">
      <img v-if="model" :src="model" alt="" class="h-14 w-14 rounded-lg object-cover border border-default bg-muted" />
      <input v-model="model" type="text" class="admin-input flex-1" placeholder="/uploads/… or /file.png" />
    </div>
    <label class="admin-btn w-max cursor-pointer">
      {{ busy ? "Uploading…" : "Upload image" }}
      <input type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/gif" class="hidden" :disabled="busy" @change="onPick" />
    </label>
    <p v-if="error" class="text-sm text-red-500 whitespace-pre-line">{{ error }}</p>
  </div>
</template>
