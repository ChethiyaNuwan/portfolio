// Shared state between the horizontal stage (home page) and the always-visible footer navigation.
export function useStageState() {
  return {
    panels: useState<{ id: string; label: string }[]>("stage-panels", () => []),
    activeId: useState<string>("stage-active", () => ""),
    progress: useState<number>("stage-progress", () => 0),
    /** true while the sections are side by side (tablet and desktop) */
    horizontal: useState<boolean>("stage-horizontal", () => false),
    /** page = plain vertical page, sideways = tablet/desktop stage */
    mode: useState<"page" | "sideways">("stage-mode", () => "page"),
    /** true once the visitor has moved between sections, so the hint can stop nudging */
    hinted: useState<boolean>("stage-hinted", () => false),
    /** increments on every tick (one section passed), so the footer can pulse in time with it */
    tickCount: useState<number>("stage-ticks", () => 0),
  };
}

/** the name a section has in the navigation and as its title; set in the admin (Sections) */
export function useSectionLabel(id: string, fallback: string) {
  const { data } = useNuxtData<{ sections?: { id: string; label: string }[] }>("content");
  return computed(() => data.value?.sections?.find((s) => s.id === id)?.label || fallback);
}

let jumper: ((id: string) => void) | null = null;
export const registerStageJump = (fn: ((id: string) => void) | null) => {
  jumper = fn;
};
export const stageJump = (id: string) => jumper?.(id);
