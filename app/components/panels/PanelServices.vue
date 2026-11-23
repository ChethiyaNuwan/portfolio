<script setup lang="ts">
const content = await useContent();
const mask = (src: string) => ({ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" });
</script>

<template>
  <StagePanel id="services" label="Services">
    <div class="flex min-h-full flex-col gap-8">
      <PanelHead id="services" title="Services" outline>
        <p class="max-w-sm text-lg text-muted"><span class="hidden [@media(hover:hover)_and_(min-width:1024px)]:inline">Hover a card to read more.</span><span class="[@media(hover:hover)_and_(min-width:1024px)]:hidden">What I can build for you.</span></p>
      </PanelHead>
      <DropGroup as="ul" class="svc-list" role="list">
        <li v-for="(s, i) in content.services" :key="s.id" class="svc">
          <article class="drop relative flex h-full flex-col gap-3 overflow-hidden border border-default bg-muted/40 p-5 outline-offset-2 max-lg:before:absolute max-lg:before:inset-y-0 max-lg:before:left-0 max-lg:before:w-0.5 max-lg:before:bg-primary md:gap-4 md:p-6 lg:p-5 xl:p-6" tabindex="0" :style="{ '--i': i }">
            <div class="flex items-center justify-between">
              <span class="grid size-12 shrink-0 place-items-center border border-default bg-default max-md:border-primary/40" aria-hidden="true"><span class="block size-6 bg-primary" :style="mask(s.icon)" /></span>
              <span class="font-mono text-sm tracking-widest text-muted md:hidden" aria-hidden="true">{{ String(i + 1).padStart(2, "0") }}</span>
            </div>
            <h3 class="font-display text-2xl font-semibold leading-tight text-highlighted md:text-xl md:[overflow-wrap:normal] lg:text-2xl lg:[overflow-wrap:anywhere] xl:text-4xl">{{ s.title }}</h3>
            <div class="svc-more">
              <p class="max-w-md overflow-hidden text-lg leading-relaxed text-muted">{{ s.description }}</p>
            </div>
          </article>
        </li>
      </DropGroup>
    </div>
  </StagePanel>
</template>
