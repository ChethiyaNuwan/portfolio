import { loadAdminConfig, type AdminConfig } from "../lib/auth";
import { openStore, type Store } from "../lib/db";

let store: Store | undefined;
let adminConfig: AdminConfig | undefined;

export async function initServerState(): Promise<void> {
  adminConfig = await loadAdminConfig(process.env);
  store = openStore(process.env.DATA_DIR || "./.data");
}

export function useStore(): Store {
  if (!store) throw new Error("Store not initialised");
  return store;
}

export function useAdminConfig(): AdminConfig {
  if (!adminConfig) throw new Error("Admin config not initialised");
  return adminConfig;
}
