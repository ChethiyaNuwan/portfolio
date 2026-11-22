/** True once (or while, with once:false) the element is visible in the viewport. */
export function useInView(el: Ref<HTMLElement | null | undefined>, opts: { once?: boolean; threshold?: number } = {}) {
  const inView = ref(false);
  onMounted(() => {
    const node = el.value;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      inView.value = true;
      return;
    }
    const once = opts.once !== false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          inView.value = true;
          if (once) io.disconnect();
        } else if (!once) inView.value = false;
      },
      { threshold: opts.threshold ?? 0.15 },
    );
    io.observe(node);
    onBeforeUnmount(() => io.disconnect());
  });
  return inView;
}
