<script setup lang="ts">
const { api, upload } = useAdminApi();

const settings = ref<{ cvMode: "uploaded" | "generated"; cvUploadUrl: string | null } | null>(null);
const busy = ref(false);
const error = ref("");
const saved = ref(false);

onMounted(async () => {
  try {
    const all = await api<{ settings: NonNullable<typeof settings.value> }>("/api/admin/content");
    settings.value = all.settings;
  } catch (err) {
    error.value = errorMessage(err);
  }
});

async function save() {
  busy.value = true;
  error.value = "";
  saved.value = false;
  try {
    settings.value = await api("/api/admin/content/settings", { method: "PUT", body: settings.value });
    saved.value = true;
  } catch (err) {
    error.value = errorMessage(err);
  } finally {
    busy.value = false;
  }
}

async function onPick(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !settings.value) return;
  busy.value = true;
  error.value = "";
  try {
    settings.value.cvUploadUrl = await upload(file, "pdf");
    await save();
  } catch (err) {
    error.value = errorMessage(err);
    busy.value = false;
  } finally {
    input.value = "";
  }
}
</script>

<template>
  <section class="flex flex-col gap-6">
    <h2 class="text-2xl font-bold">CV</h2>
    <p class="text-light-gray-2">Visitors download your CV from the home page. Choose where it comes from.</p>
    <p v-if="error" class="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400 whitespace-pre-line">{{ error }}</p>
    <p v-if="saved" class="rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-400">Saved.</p>

    <div v-if="settings" class="grid gap-4">
      <label class="flex items-start gap-3 rounded-xl border border-dark-gray-3 bg-very-dark-gray p-4 cursor-pointer">
        <input v-model="settings.cvMode" type="radio" value="generated" class="mt-1" />
        <span>
          <span class="font-semibold">Generated from portfolio details</span>
          <span class="block text-sm text-light-gray-2">Built live from your profile, experience, stack, projects and services.</span>
        </span>
      </label>
      <label class="flex items-start gap-3 rounded-xl border border-dark-gray-3 bg-very-dark-gray p-4 cursor-pointer">
        <input v-model="settings.cvMode" type="radio" value="uploaded" class="mt-1" />
        <span>
          <span class="font-semibold">Uploaded PDF</span>
          <span class="block text-sm text-light-gray-2">
            {{ settings.cvUploadUrl ? `Current file: ${settings.cvUploadUrl}` : "No file uploaded yet — the generated CV is used until you upload one." }}
          </span>
        </span>
      </label>

      <div class="flex flex-wrap gap-3">
        <label class="admin-btn cursor-pointer">
          {{ busy ? "Working…" : "Upload PDF" }}
          <input type="file" accept="application/pdf" class="hidden" :disabled="busy" @change="onPick" />
        </label>
        <button class="admin-btn-primary" :disabled="busy" @click="save">Save mode</button>
        <a href="/cv" target="_blank" class="admin-btn">Preview /cv</a>
      </div>
    </div>
  </section>
</template>
