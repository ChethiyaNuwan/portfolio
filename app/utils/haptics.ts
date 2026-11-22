// Haptic feedback for scroll ticks, as far as the web allows:
//  - Android / Chrome: the Vibration API (navigator.vibrate).
//  - iOS Safari 17.4+: toggling a hidden <input type="checkbox" switch> gives a light tap (best effort, must happen
//    inside a touch gesture).
//  - Mac trackpads: browsers do not expose the Taptic Engine to web pages, so there is nothing to call.
export type HapticResult = "vibrate" | "ios" | "none";

let iosLabel: HTMLLabelElement | null = null;

function iosSwitchTap(nav: Navigator | undefined): boolean {
  if (typeof document === "undefined" || !nav) return false;
  const iOS = /iPhone|iPad|iPod/.test(nav.userAgent ?? "") || (/Mac/.test(nav.platform ?? "") && (nav.maxTouchPoints ?? 0) > 1);
  if (!iOS) return false;
  if (!iosLabel) {
    const id = "haptic-switch";
    const label = document.createElement("label");
    label.setAttribute("aria-hidden", "true");
    label.style.cssText = "position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = id;
    input.setAttribute("switch", "");
    input.tabIndex = -1;
    label.htmlFor = id;
    label.append(input);
    document.body.append(label);
    iosLabel = label;
  }
  iosLabel.click();
  return true;
}

/** "tick" = a short pulse for each detent; "bump" = a double pulse when you hit the first or last section. */
export function tickHaptic(kind: "tick" | "bump" = "tick", nav: Navigator | undefined = typeof navigator !== "undefined" ? navigator : undefined): HapticResult {
  try {
    if (nav && typeof nav.vibrate === "function") {
      nav.vibrate(kind === "tick" ? 8 : [14, 40, 14]);
      return "vibrate";
    }
    return iosSwitchTap(nav) ? "ios" : "none";
  } catch {
    return "none";
  }
}
