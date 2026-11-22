import { initServerState } from "../utils/store";

// Fail fast: refuse to boot without valid admin credentials.
export default defineNitroPlugin(async () => {
  try {
    await initServerState();
  } catch (err) {
    console.error(`\n[startup] ${(err as Error).message}\n`);
    process.exit(1);
  }
});
