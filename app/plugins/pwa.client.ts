// Registers the service worker (production only: in development it would cache stale code) and remembers the
// browser's install prompt so the command palette can offer "Install app".
interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default defineNuxtPlugin(() => {
  const installEvent = useState<InstallPromptEvent | null>("pwa-install", () => null);

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    installEvent.value = e as InstallPromptEvent;
  });
  window.addEventListener("appinstalled", () => (installEvent.value = null));

  if (import.meta.dev || !("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
  });
});
