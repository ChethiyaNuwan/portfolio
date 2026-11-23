<script setup lang="ts">
const content = await useContent();
const mask = (src: string) => ({ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" });
</script>

<template>
  <StagePanel id="services" label="Services">
    <div class="flex min-h-full flex-col gap-8">
      <PanelHead id="services" title="Services" outline>
        <p class="max-w-sm text-lg text-muted">Hover a card to read more.</p>
      </PanelHead>
      <DropGroup as="ul" class="svc-list" role="list">
        <li v-for="(s, i) in content.services" :key="s.id" class="svc">
          <article class="drop flex h-full flex-col gap-4 border border-default bg-muted/40 p-6 outline-offset-2 lg:p-5 xl:p-6" tabindex="0" :style="{ '--i': i }">
            <span class="size-10 shrink-0 bg-primary" aria-hidden="true" :style="mask(s.icon)" />
            <h3 class="font-display text-3xl font-semibold leading-tight text-highlighted md:text-xl md:[overflow-wrap:normal] lg:text-2xl lg:[overflow-wrap:anywhere] xl:text-4xl">{{ s.title }}</h3>
            <div class="svc-more">
              <p class="max-w-md overflow-hidden text-lg leading-relaxed text-muted">{{ s.description }}</p>
            </div>
          </article>
        </li>
      </DropGroup>
    </div>
  </StagePanel>
</template>
