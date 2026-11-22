// Public content for SSR pages. Admin-only settings (CV mode / upload) are not exposed.
export default defineEventHandler(() => {
  const { settings: _settings, ...publicContent } = useStore().getContent();
  return publicContent;
});
