<script setup lang="ts">
// FAQ that types itself: each question types out, then its answer, then the next pair. The complete text is always
// in the page (one span per character, revealed by CSS delays), so readers and agents are not affected by the effect.
const props = defineProps<{ items: { id: string; question: string; answer: string }[] }>();

const Q_SPEED = 26; // ms per character
const A_SPEED = 11;
const GAP = 220; // between a question and its answer
const PAUSE = 520; // after an answer

const root = ref<HTMLElement>();
const inView = useInView(root, { threshold: 0.25 });
const skipped = ref(false);

interface Ch {
  ch: string;
  t: number;
  d: number;
}
function spell(text: string, start: number, speed: number, hold: number): { words: Ch[][]; end: number } {
  let n = 0;
  const words = text.split(" ").map((w) => [...w].map((ch) => ({ ch, t: start + n++ * speed, d: speed }) as Ch));
  const last = words.flat().at(-1);
  if (last) last.d = hold; // the caret rests on the last character before the next one starts
  return { words, end: start + n * speed };
}

const lines = computed(() => {
  let t = 250;
  return props.items.map((it) => {
    const q = spell(it.question, t, Q_SPEED, GAP);
    const a = spell(it.answer, q.end + GAP, A_SPEED, PAUSE);
    t = a.end + PAUSE;
    return { id: it.id, q: q.words, a: a.words };
  });
});
</script>

<template>
  <div ref="root" class="faq-type" :class="{ 'is-typing': inView && !skipped, 'faq-done': skipped }">
    <div class="mb-4 flex items-center justify-between gap-4">
      <h3 id="faq-heading" class="font-display text-xl font-semibold text-highlighted">Common questions</h3>
      <UButton v-if="!skipped" size="xs" color="neutral" variant="ghost" label="Skip animation" @click="skipped = true" />
    </div>
    <dl class="flex flex-col gap-5" aria-labelledby="faq-heading">
      <div v-for="l in lines" :key="l.id" class="flex flex-col gap-1">
        <dt class="faq-q font-display text-base font-medium text-highlighted sm:text-lg">
          <template v-for="(w, wi) in l.q" :key="wi">
            <span class="inline-block"><span v-for="(c, ci) in w" :key="ci" class="tw" :style="{ '--t': `${c.t}ms`, '--d': `${c.d}ms` }">{{ c.ch }}</span></span>{{ " " }}
          </template>
        </dt>
        <dd class="faq-a text-sm leading-relaxed text-muted">
          <template v-for="(w, wi) in l.a" :key="wi">
            <span class="inline-block"><span v-for="(c, ci) in w" :key="ci" class="tw" :style="{ '--t': `${c.t}ms`, '--d': `${c.d}ms` }">{{ c.ch }}</span></span>{{ " " }}
          </template>
        </dd>
      </div>
    </dl>
  </div>
</template>
