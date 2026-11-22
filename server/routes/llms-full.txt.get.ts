import { llmsFullTxt } from "../lib/seo";

export default defineEventHandler((event) => {
  setHeader(event, "Content-Type", "text/plain; charset=utf-8");
  return llmsFullTxt(useStore().getContent(), siteUrlFor(event));
});
