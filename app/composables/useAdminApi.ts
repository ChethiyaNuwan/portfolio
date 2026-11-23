type Method = "GET" | "POST" | "PUT" | "DELETE";

export function useAdminApi() {
  const csrf = useState<string | null>("admin-csrf", () => null);

  async function ensureCsrf(): Promise<string> {
    if (!csrf.value) {
      const s = await $fetch<{ authenticated: boolean; csrfToken?: string }>("/api/auth/session");
      csrf.value = s.csrfToken ?? null;
    }
    if (!csrf.value) {
      await navigateTo("/admin/login");
      throw new Error("Not authenticated");
    }
    return csrf.value;
  }

  async function api<T>(url: string, opts: { method?: Method; body?: unknown } = {}): Promise<T> {
    const method = opts.method ?? "GET";
    const headers: Record<string, string> = {};
    if (method !== "GET") headers["x-csrf-token"] = await ensureCsrf();
    try {
      return (await ($fetch as (u: string, o: object) => Promise<unknown>)(url, { method, body: opts.body, headers })) as T;
    } catch (err) {
      const status = (err as { statusCode?: number }).statusCode;
      if (status === 401) {
        csrf.value = null;
        await navigateTo("/admin/login");
      }
      throw err;
    }
  }

  async function login(username: string, password: string) {
    const res = await $fetch<{ csrfToken: string }>("/api/auth/login", { method: "POST", body: { username, password } });
    csrf.value = res.csrfToken;
  }

  const passkeysSupported = () => typeof window !== "undefined" && !!window.PublicKeyCredential;

  /** Sign in with a registered passkey (the browser shows its own picker). */
  async function loginWithPasskey() {
    const { startAuthentication } = await import("@simplewebauthn/browser");
    const options = await $fetch<Parameters<typeof startAuthentication>[0]["optionsJSON"]>("/api/auth/passkey/options", { method: "POST" });
    const response = await startAuthentication({ optionsJSON: options });
    const res = await $fetch<{ csrfToken?: string; message?: string }>("/api/auth/passkey/verify", { method: "POST", body: { response }, ignoreResponseError: true });
    if (!res.csrfToken) throw new Error(res.message || "Invalid passkey");
    csrf.value = res.csrfToken;
  }

  /** Add a passkey to the signed-in admin account. */
  async function addPasskey(name: string) {
    const { startRegistration } = await import("@simplewebauthn/browser");
    const options = await api<Parameters<typeof startRegistration>[0]["optionsJSON"]>("/api/admin/passkeys/options", { method: "POST" });
    const response = await startRegistration({ optionsJSON: options });
    await api("/api/admin/passkeys/verify", { method: "POST", body: { response, name } });
  }

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    csrf.value = null;
    await navigateTo("/admin/login");
  }

  async function upload(file: File, kind: "image" | "pdf"): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    const res = await api<{ url: string }>(`/api/admin/upload?kind=${kind}`, { method: "POST", body: form });
    return res.url;
  }

  return { api, login, logout, upload, passkeysSupported, loginWithPasskey, addPasskey };
}

/** Human-readable message from a failed $fetch (validation issues, upload errors, rate limit). */
export function errorMessage(err: unknown): string {
  const e = err as { data?: { message?: string; statusMessage?: string; issues?: { path: string; message: string }[] }; statusMessage?: string; message?: string };
  const issues = e.data?.issues;
  if (issues?.length) return issues.map((i) => `${i.path || "value"}: ${i.message}`).join("\n");
  return e.data?.statusMessage || e.data?.message || e.statusMessage || e.message || "Something went wrong";
}
