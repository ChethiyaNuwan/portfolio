<script setup lang="ts">
import { formVariants } from "~/animation/varients";

const isSubmitting = ref(false);
const loader = ref(false);
const errorOnSubmit = ref(false);
const errorMessage = ref("");

const data = reactive({ name: "", email: "", message: "" });

type FormErrors = { name?: string; email?: string; message?: string; general?: string };
const errors = ref<FormErrors>({});

const validate = () => {
  const next: FormErrors = {};

  if (!data.name.trim()) {
    next.name = "Please enter your name.";
  } else if (data.name.trim().length < 2) {
    next.name = "Name must be at least 2 characters.";
  }

  const email = data.email.trim();
  if (!email) {
    next.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    next.email = "Please enter a valid email address.";
  }

  if (!data.message.trim()) {
    next.message = "Please enter a message.";
  } else if (data.message.trim().length < 10) {
    next.message = "Message must be at least 10 characters.";
  }

  errors.value = next;
  return Object.keys(next).length === 0;
};

const handleSubmit = async () => {
  // Client-side validation first
  if (!validate()) return;

  isSubmitting.value = true;
  loader.value = true;
  errorOnSubmit.value = false;
  errorMessage.value = "";

  try {
    await $fetch("/api/contact", {
      method: "POST",
      body: {
        name: data.name.trim(),
        email: data.email.trim(),
        message: data.message.trim(),
      },
    });
    // Success
    Object.assign(data, { name: "", email: "", message: "" });
    errors.value = {};
    errorOnSubmit.value = false;
  } catch (err) {
    errorOnSubmit.value = true;
    // $fetch throws FetchError for non-2xx responses (no `response` for network failures)
    if (!(err as { response?: unknown }).response) {
      errorMessage.value = "Network error. Please try again later.";
    }
  } finally {
    loader.value = false;
    // Keep the success/error screen visible briefly, then reset back
    setTimeout(() => {
      isSubmitting.value = false;
    }, 6000);
  }
};

const inputClass =
  "appearance-none w-full leading-[1.4em] outline-none border-none p-4 rounded-lg font-medium text-base placeholder:text-light-gray-1 text-very-light-gray bg-dark-gray-2";
</script>

<template>
  <Motion initial="hidden" animate="visible" :variants="formVariants" class="gap-0 flex flex-col w-full">
    <div
      v-if="isSubmitting"
      class="h-full min-h-[350px] w-full relative flex flex-col items-center justify-center bg-dark-gray-2 rounded-xl border border-dark-gray-3 select-none"
    >
      <Loader v-if="loader" />
      <SuccessForm v-else :action="errorOnSubmit ? 'error' : 'success'" />
    </div>
    <form v-else method="POST" class="grid gap-4" @submit.prevent="handleSubmit">
      <!-- Input Fields -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <input
            v-model="data.name"
            :class="[inputClass, errors.name && 'ring-1 ring-red-500']"
            name="Name"
            placeholder="Name"
            type="text"
            aria-label="Full Name"
            :aria-invalid="!!errors.name"
            @blur="validate"
          />
          <p v-if="errors.name" class="mt-2 text-sm text-red-500">{{ errors.name }}</p>
        </div>
        <div>
          <input
            v-model="data.email"
            :class="[inputClass, errors.email && 'ring-1 ring-red-500']"
            name="Email"
            placeholder="Email"
            type="email"
            aria-label="Email Address"
            :aria-invalid="!!errors.email"
            @blur="validate"
          />
          <p v-if="errors.email" class="mt-2 text-sm text-red-500">{{ errors.email }}</p>
        </div>
      </div>
      <!-- Textarea -->
      <textarea
        v-model="data.message"
        :class="[inputClass, 'resize-y min-h-56 max-h-96', errors.message && 'ring-1 ring-red-500']"
        name="Message"
        placeholder="Message"
        rows="8"
        aria-label="Message"
        :aria-invalid="!!errors.message"
        @blur="validate"
      />
      <p v-if="errors.message" class="-mt-2 text-sm text-red-500">{{ errors.message }}</p>

      <div v-if="errors.general" class="-mt-1 text-sm text-red-500">{{ errors.general }}</div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loader"
        class="w-full bg-almost-black text-white p-4 rounded-lg font-medium hover:bg-dark-gray-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loader ? "Sending…" : "Send Your Message" }}
      </button>
    </form>

    <!-- Submit feedback overlay content shows errors too -->
    <p v-if="isSubmitting && !loader && errorOnSubmit && errorMessage" class="mt-3 text-center text-red-500 text-sm">
      {{ errorMessage }}
    </p>
  </Motion>
</template>
