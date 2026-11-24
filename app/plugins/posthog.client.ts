// PostHog: page views, session replay, and the events that show what visitors care about.
//  - session replay (inputs masked), autocapture, page views and GeoIP location (PostHog enriches each event from the
//    visitor's IP: country, region and city) are PostHog's own;
//  - clicks on the CV, mail links, social/outbound links and anything marked data-track are sent as named events;
//  - section_view / section_dwell record which sections hold attention and for how long (time only counts while the
//    tab is visible).
// Every event carries environment (dev or production) so local testing can be filtered out. Nothing loads without NUXT_PUBLIC_POSTHOG_KEY, on /admin, or for browsers that ask not to be tracked. Open the site
// once with ?notrack to exclude your own browser (?track turns it back on).
import { setTrackSink, track } from "~/utils/track";

const OPT_OUT = "ph-opt-out";

export default defineNuxtPlugin(() => {
  const { posthogKey, posthogHost } = useRuntimeConfig().public;
  if (!posthogKey) return;

  const url = new URL(location.href);
  if (url.searchParams.has("notrack")) localStorage.setItem(OPT_OUT, "1");
  if (url.searchParams.has("track")) localStorage.removeItem(OPT_OUT);
  if (localStorage.getItem(OPT_OUT) || url.pathname.startsWith("/admin")) return;
  if (navigator.doNotTrack === "1") return;

  const start = async () => {
    const { default: posthog } = await import("posthog-js");
    posthog.init(posthogKey, {
      api_host: posthogHost || "https://us.i.posthog.com",
      defaults: "2025-05-24", // page views on client-side navigation, current recommended behaviour
      person_profiles: "identified_only", // anonymous visitors do not become paid person profiles
      respect_dnt: true,
      capture_pageview: "history_change",
      capture_pageleave: true,
      autocapture: true,
      session_recording: { maskAllInputs: true, maskTextSelector: undefined },
      loaded: (ph) => {
        // extra location hints next to PostHog's IP lookup: the visitor's own time zone and languages
        ph.register({ environment: import.meta.dev ? "dev" : "production", tz: Intl.DateTimeFormat().resolvedOptions().timeZone, langs: navigator.languages?.join(",") });
      },
    });
    setTrackSink((event, props) => posthog.capture(event, props, { transport: "sendBeacon" }));

    const { activeId } = useStageState();
    let current = "";
    let since = 0; // ms of visible time on the current section
    let resumed = performance.now();
    const visible = () => document.visibilityState === "visible";
    const flush = () => {
      if (visible()) since += performance.now() - resumed;
      resumed = performance.now();
      const seconds = Math.round(since / 100) / 10;
      if (current && seconds >= 1) track("section_dwell", { section: current, seconds });
      since = 0;
    };
    watch(
      activeId,
      (id) => {
        if (!id || id === current) return;
        flush();
        current = id;
        track("section_view", { section: id });
      },
      { immediate: true },
    );
    document.addEventListener("visibilitychange", () => {
      if (visible()) resumed = performance.now();
      else {
        since += performance.now() - resumed;
        flush();
      }
    });
    window.addEventListener("pagehide", flush);

    // Clicks that matter. data-track="name" on an element names the event (data-track-xyz="…" adds a property xyz);
    // otherwise CV downloads, mail links and links to other sites are recognised from the link itself.
    document.addEventListener(
      "click",
      (e) => {
        const el = (e.target as Element | null)?.closest<HTMLElement>("a, button, [data-track]");
        if (!el) return;
        const props: Record<string, string> = { section: current };
        const tagged = el.closest<HTMLElement>("[data-track]");
        for (const [k, v] of Object.entries((tagged ?? el).dataset)) if (k.startsWith("track") && k !== "track" && v) props[k.slice(5).toLowerCase()] = v;
        if (tagged?.dataset.track) return track(tagged.dataset.track, props);
        if (!(el instanceof HTMLAnchorElement)) return;
        const href = el.getAttribute("href") ?? "";
        if (href.startsWith("mailto:")) return track("email_click", props);
        if (href === "/cv" || href.startsWith("/cv?")) return track("cv_download", props);
        if (href.startsWith("tel:")) return track("phone_click", props);
        if (el.host && el.host !== location.host) track("outbound_click", { ...props, host: el.host, label: el.getAttribute("aria-label") ?? el.textContent?.trim().slice(0, 40) ?? "" });
      },
      { capture: true },
    );
  };

  // start when the browser is idle; the page has often finished loading by the time this plugin runs, so do not wait for "load"
  const later = () => ("requestIdleCallback" in window ? requestIdleCallback(start, { timeout: 3000 }) : setTimeout(start, 1500));
  if (document.readyState === "complete") later();
  else window.addEventListener("load", later, { once: true });
});
