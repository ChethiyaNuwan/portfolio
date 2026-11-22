// Shared state between the horizontal stage (home page) and the always-visible footer navigation.
export function useStageState() {
  return {
    panels: useState<{ id: string; label: string }[]>("stage-panels", () => []),
    activeId: useState<string>("stage-active", () => ""),
    progress: useState<number>("stage-progress", () => 0),
    horizontal: useState<boolean>("stage-horizontal", () => false),
    /** true once the visitor has moved between sections, so the hint can stop nudging */
    hinted: useState<boolean>("stage-hinted", () => false),
    /** increments on every tick (one section passed), so the footer can pulse in time with it */
    tickCount: useState<number>("stage-ticks", () => 0),
  };
}

let jumper: ((id: string) => void) | null = null;
export const registerStageJump = (fn: ((id: string) => void) | null) => {
  jumper = fn;
};
export const stageJump = (id: string) => jumper?.(id);
