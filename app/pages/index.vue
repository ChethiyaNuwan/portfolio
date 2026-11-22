<script setup lang="ts">
const content = await useContent();

useSeoMeta({
  title: `${content.value.profile.name} • Portfolio`,
  description: content.value.profile.intro.slice(0, 160),
});
</script>

<template>
  <div>
    <HeroSection />
    <StatsRow />

    <section class="py-16 sm:py-20">
      <UContainer>
        <SectionHeader title="Selected work" description="Recent projects I designed and built.">
          <template #action>
            <UButton to="/work" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right" label="All projects" />
          </template>
        </SectionHeader>
      </UContainer>
      <UContainer>
        <ProjectCarousel />
      </UContainer>
    </section>

    <section class="py-16 sm:py-20">
      <UContainer>
        <SectionHeader title="Experience" description="Where I have worked and what I did there." />
        <ExperienceList />
      </UContainer>
    </section>

    <section class="py-16 sm:py-20">
      <UContainer>
        <SectionHeader title="Skills" description="Languages, frameworks and tools I use day to day." />
        <SkillsGrid />
      </UContainer>
    </section>

    <section class="py-16 sm:py-20">
      <UContainer>
        <SectionHeader title="Services" description="How I can help on your next project." />
        <ServicesGrid />
      </UContainer>
    </section>

    <section v-if="content.gallery.length" class="py-16 sm:py-20">
      <UContainer>
        <SectionHeader title="Gallery" description="A look at the interfaces and designs behind the work.">
          <template #action>
            <UButton to="/gallery" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right" label="Open gallery" />
          </template>
        </SectionHeader>
        <GalleryMasonry :limit="6" />
      </UContainer>
    </section>

    <ContactBand />
  </div>
</template>
