export default defineEventHandler(async (event) => {
  const session = await requireCsrf(event);
  await session.clear();
  return { ok: true };
});
