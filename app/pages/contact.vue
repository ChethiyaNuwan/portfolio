<script setup lang="ts">
import { Mail } from "lucide-vue-next";
import { emailIcon, questionMarkIcon } from "~/utils/assets";

const content = await useContent();

useSeoMeta({
  title: "Chethiya Nuwan • Contact",
  description: "Get in touch with me. Connect for collaboration, questions, or just to say hello!",
});
</script>

<template>
  <div class="flex flex-col flex-1 gap-0 h-min overflow-hidden p-0 relative w-full items-center justify-start">
    <div class="flex flex-col gap-[60px] w-full max-w-full px-5 lg:px-0 lg:max-w-[750px] lg:w-[80%] items-center p-[80px_0px]">
      <SectionHeading
        :icon="emailIcon"
        title="I Love to hear from you."
        description="Connect with Me Today. Let's Create Something Amazing Together!"
      >
        <div class="w-full">
          <AppButton
            class-name="w-min"
            title="Email Me"
            :icon="Mail"
            :href="`mailto:${content.profile.email}`"
          />
        </div>
      </SectionHeading>

      <SectionHeading
        :icon="questionMarkIcon"
        title="Common Queries"
        description="Get Answers to Common Queries. Your Questions, Addressed Simply."
      />

      <FAQ :data="content.faq" />
    </div>
  </div>
</template>
