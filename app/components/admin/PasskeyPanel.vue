<script setup lang="ts">
const { api, addPasskey, passkeysSupported } = useAdminApi();

interface Passkey {
  id: string;
  name: string;
  createdAt: number;
  lastUsedAt: number | null;
}

const list = ref<Passkey[]>([]);
const name = ref("");
const busy = ref(false);
const error = ref("");
const notice = ref("");
const supported = ref(true);

const when = (t: number | null) => (t ? new Date(t).toLocaleString() : "never");

async function load() {
  list.value = await api<Passkey[]>("/api/admin/passkeys");
}

async function add() {
  busy.value = true;
  error.value = "";
  notice.value = "";
  try {
    await addPasskey(name.value.trim());
    name.value = "";
    notice.value = "Passkey added. You can now sign in with it.";
    await load();
  } catch (err) {
    const e = err as { name?: string };
    error.value = e.name === "NotAllowedError" ? "Cancelled." : e.name === "InvalidStateError" ? "This device already has a passkey registered." : errorMessage(err);
  } finally {
    busy.value = false;
  }
}

async function remove(p: Passkey) {
  if (!confirm(`Remove the passkey "${p.name}"?`)) return;
  error.value = "";
  try {
    await api(`/api/admin/passkeys/${encodeURIComponent(p.id)}`, { method: "DELETE" });
    await load();
  } catch (err) {
    error.value = errorMessage(err);
  }
}

onMounted(async () => {
  supported.value = passkeysSupported();
  await load();
});
</script>

<template>
  <section class="flex flex-col gap-6">
    <header>
      <h2 class="text-xl font-bold">Passkeys</h2>
      <p class="mt-1 text-sm text-muted">Sign in with your fingerprint, face or a security key instead of typing the password. The password keeps working as a fallback.</p>
    </header>

    <form class="grid gap-3 rounded-xl border border-default bg-muted p-4 sm:max-w-md" @submit.prevent="add">
      <label class="flex flex-col gap-1">
        <span class="text-sm text-muted">Name (optional, to tell your devices apart)</span>
        <input v-model="name" class="admin-input" type="text" maxlength="60" placeholder="e.g. MacBook, iPhone" :disabled="!supported" />
      </label>
      <button class="admin-btn-primary" type="submit" :disabled="busy || !supported">{{ busy ? "Waiting for your device…" : "Add a passkey" }}</button>
      <p v-if="!supported" class="text-sm text-red-500">This browser does not support passkeys.</p>
      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
      <p v-if="notice" class="text-sm text-green-500" role="status">{{ notice }}</p>
    </form>

    <div>
      <h3 class="mb-2 font-semibold">Registered passkeys</h3>
      <p v-if="!list.length" class="text-sm text-muted">None yet.</p>
      <ul v-else class="flex flex-col gap-2 sm:max-w-md">
        <li v-for="p in list" :key="p.id" class="flex items-center justify-between gap-3 rounded-lg border border-default p-3">
          <div class="min-w-0">
            <p class="truncate font-medium">{{ p.name }}</p>
            <p class="text-xs text-muted">Added {{ when(p.createdAt) }} · last used {{ when(p.lastUsedAt) }}</p>
          </div>
          <button class="admin-btn shrink-0" type="button" @click="remove(p)">Remove</button>
        </li>
      </ul>
    </div>
  </section>
</template>
