<script setup lang="ts">
defineProps<{ action?: "success" | "error" }>();
</script>

<template>
  <Motion
    :initial="{ scale: 0.8 }"
    :animate="{ scale: 0.7, y: -20 }"
    :transition="{ delay: 1, duration: 0.5, ease: 'easeOut' }"
    class="relative inset-0 h-full w-full grid place-items-center"
  >
    <Motion
      :initial="{ scale: 0.8, opacity: 0 }"
      :animate="{ scale: 1, opacity: 1 }"
      :transition="{ duration: 0.5, ease: 'easeOut' }"
    >
      <div
        class="bg-zinc-800/15 before:border-zinc-800/50 before:bg-zinc-800/30 border-zinc-800/20 h-72 w-72 relative rounded-full before:content-[''] border before:border before:absolute flex items-center justify-center before:h-[75%] before:w-[75%] before:rounded-full"
      >
        <Motion
          :initial="{ scale: 0 }"
          :animate="{ scale: 1 }"
          :transition="{ delay: 0.3, duration: 0.5, ease: 'easeOut' }"
          class="bg-zinc-800/50 border border-zinc-700/50 h-1/2 w-1/2 rounded-full grid place-items-center"
        >
          <Motion
            v-if="action === 'success'"
            as="svg"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :transition="{ delay: 0.8, duration: 0.5, ease: 'easeInOut' }"
            fill="#64646f"
            xmlns="http://www.w3.org/2000/svg"
            width="70"
            height="70"
            viewBox="0 0 24 24"
          >
            <path d="M 20.292969 5.2929688 L 9 16.585938 L 4.7070312 12.292969 L 3.2929688 13.707031 L 9 19.414062 L 21.707031 6.7070312 L 20.292969 5.2929688 z" />
          </Motion>
          <Motion
            v-else
            as="svg"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :transition="{ delay: 0.8, duration: 0.5, ease: 'easeInOut' }"
            stroke="#ff7d76"
            fill="#ff7d76"
            stroke-width="0"
            viewBox="0 0 24 24"
            width="50"
            height="50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="none" d="M0 0h24v24H0V0z" />
            <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
          </Motion>
        </Motion>
      </div>
    </Motion>
  </Motion>

  <!-- Text Message -->
  <div class="text-center -translate-y-12 text-lg font-semibold mt-4">
    <Motion
      as="p"
      :initial="{ opacity: 0, y: 10 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ delay: 1.5, duration: 0.5, ease: 'easeOut' }"
      :class="[action === 'success' ? 'text-[#959393]' : 'text-[#ff7d76]', 'text-base']"
    >
      {{ action === "success" ? " Thank you 🎉" : "Oops! An error occurred." }}
    </Motion>
  </div>
</template>
