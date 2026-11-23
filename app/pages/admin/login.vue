<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });

const { login, loginWithPasskey, passkeysSupported } = useAdminApi();
const canPasskey = ref(false);
onMounted(() => (canPasskey.value = passkeysSupported()));
const username = ref("");
const password = ref("");
const busy = ref(false);
const error = ref("");

async function submit() {
  busy.value = true;
  error.value = "";
  try {
    await login(username.value, password.value);
    await navigateTo("/admin");
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode;
    error.value = status === 429 ? "Too many attempts. Please wait and try again." : "Invalid credentials";
  } finally {
    busy.value = false;
    password.value = "";
  }
}

async function usePasskey() {
  busy.value = true;
  error.value = "";
  try {
    await loginWithPasskey();
    await navigateTo("/admin");
  } catch (err) {
    const e = err as { name?: string; statusCode?: number; message?: string };
    error.value = e.statusCode === 429 ? "Too many attempts. Please wait and try again." : e.name === "NotAllowedError" ? "Passkey sign-in was cancelled." : "Could not sign in with a passkey.";
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen grid place-items-center p-6">
    <form class="w-full max-w-sm grid gap-4 rounded-xl border border-default bg-muted p-6" @submit.prevent="submit">
      <h1 class="text-2xl font-bold">Admin sign in</h1>
      <label class="flex flex-col gap-1">
        <span class="text-sm text-muted">Username</span>
        <input v-model="username" class="admin-input" type="text" autocomplete="username" required />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-sm text-muted">Password</span>
        <input v-model="password" class="admin-input" type="password" autocomplete="current-password" required />
      </label>
      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
      <button class="admin-btn-primary" type="submit" :disabled="busy">{{ busy ? "Signing in…" : "Sign in" }}</button>
      <template v-if="canPasskey">
        <p class="text-center text-xs text-muted">or</p>
        <button class="admin-btn" type="button" :disabled="busy" @click="usePasskey">Sign in with a passkey</button>
      </template>
    </form>
  </div>
</template>
