import { llmsTxt } from "../lib/seo";

export default defineEventHandler((event) => {
  setHeader(event, "Content-Type", "text/plain; charset=utf-8");
  return llmsTxt(useStore().getContent(), siteUrlFor(event));
});
