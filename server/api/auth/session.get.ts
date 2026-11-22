export default defineEventHandler(async (event) => {
  const session = await getAdminSession(event);
  if (!session.data.authenticated) return { authenticated: false };
  return { authenticated: true, csrfToken: session.data.csrf };
});
