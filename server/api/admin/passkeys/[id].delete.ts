export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id") ?? "";
  if (!useStore().deletePasskey(id)) throw createError({ statusCode: 404, statusMessage: "Passkey not found" });
  return { ok: true };
});
