// Lists the registered passkeys (never the keys themselves).
export default defineEventHandler(() =>
  useStore()
    .listPasskeys()
    .map((p) => ({ id: p.id, name: p.name, createdAt: p.createdAt, lastUsedAt: p.lastUsedAt })),
);
