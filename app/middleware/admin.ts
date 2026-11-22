// Guards admin pages (the API enforces auth independently).
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === "/admin/login") return;
  const session = await useRequestFetch()<{ authenticated: boolean }>("/api/auth/session");
  if (!session.authenticated) return navigateTo("/admin/login");
});
