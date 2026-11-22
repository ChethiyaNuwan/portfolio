<script setup lang="ts">
const content = await useContent();

usePageMeta({
  title: `Services • ${content.value.profile.name}`,
  description: "Professional web development, design and software engineering services.",
  path: "/services",
});

const mask = (src: string) => ({
  maskImage: `url(${src})`,
  WebkitMaskImage: `url(${src})`,
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
});
</script>

<template>
  <div>
    <section class="py-14 sm:py-20">
      <UContainer>
        <SectionHeader title="Services" description="Web development, design and software engineering for products that need to work and look right." />
        <div class="grid gap-5 sm:grid-cols-2">
          <article v-for="plan in content.plans" :key="plan.id" class="flex flex-col gap-5 rounded-2xl border border-default bg-elevated/40 p-6">
            <div class="flex items-center gap-3">
              <div class="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                <span class="size-6 bg-primary" aria-hidden="true" :style="mask(plan.icon)" />
              </div>
              <h3 class="text-xl font-semibold text-highlighted">{{ plan.service }}</h3>
            </div>
            <p class="leading-relaxed text-muted">{{ plan.description }}</p>
            <dl class="mt-auto divide-y divide-default rounded-xl border border-default">
              <div class="flex items-center justify-between px-4 py-3">
                <dt class="text-muted">Completed works</dt>
                <dd class="font-semibold text-highlighted">{{ plan.completedWorks }}</dd>
              </div>
              <div class="flex items-center justify-between px-4 py-3">
                <dt class="text-muted">Experience</dt>
                <dd class="font-semibold text-highlighted">{{ plan.experience }}</dd>
              </div>
            </dl>
          </article>
        </div>
      </UContainer>
    </section>

    <section class="py-14 sm:py-20">
      <UContainer>
        <SectionHeader title="Skills" description="Languages, frameworks and tools I use day to day." />
        <SkillsGrid />
      </UContainer>
    </section>

    <ContactBand />
  </div>
</template>
