import type { PublicContent } from "../../server/lib/schemas";

/** Public site content, server-rendered from the admin-managed store. */
export async function useContent() {
  const { data, error } = await useFetch<PublicContent>("/api/content", { key: "content" });
  if (!data.value) {
    throw createError({ statusCode: 500, statusMessage: "Failed to load content", cause: error.value });
  }
  return data as Ref<PublicContent>;
}
