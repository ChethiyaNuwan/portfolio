<script setup lang="ts">
// The stack items a project is built with (picked in the admin). While it is on screen a highlight runs along the
// chips one by one; hovering them stops it.
const props = defineProps<{ ids: string[]; size?: "sm" | "md" }>();
const content = await useContent();

const items = computed(() => props.ids.map((id) => content.value.stack.find((s) => s.id === id)).filter((s): s is NonNullable<typeof s> => !!s));
const root = ref<HTMLElement>();
const { active, bind } = useCycle(root, () => items.value.length, { interval: 1100 });
</script>

<template>
  <ul v-if="items.length" ref="root" class="flex flex-wrap gap-1.5" role="list" aria-label="Built with" v-bind="bind">
    <li
      v-for="(s, i) in items"
      :key="s.id"
      class="chip-loop flex items-center gap-1.5 border border-default bg-default/60 text-muted"
      :class="[active === i && 'is-on', size === 'md' ? 'px-2.5 py-1.5 text-sm' : 'px-2 py-1 text-xs']"
    >
      <img :src="s.logo" alt="" class="object-contain" :class="size === 'md' ? 'size-4' : 'size-3.5'" />
      {{ s.title }}
    </li>
  </ul>
</template>
