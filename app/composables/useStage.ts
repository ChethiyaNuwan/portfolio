// Shared state between the horizontal stage (home page) and the always-visible footer navigation.
export function useStageState() {
  return {
    panels: useState<{ id: string; label: string }[]>("stage-panels", () => []),
    activeId: useState<string>("stage-active", () => ""),
    progress: useState<number>("stage-progress", () => 0),
    horizontal: useState<boolean>("stage-horizontal", () => false),
  };
}

let jumper: ((id: string) => void) | null = null;
export const registerStageJump = (fn: ((id: string) => void) | null) => {
  jumper = fn;
};
export const stageJump = (id: string) => jumper?.(id);
