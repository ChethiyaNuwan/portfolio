import { robotsTxt } from "../lib/seo";

export default defineEventHandler((event) => {
  setHeader(event, "Content-Type", "text/plain; charset=utf-8");
  return robotsTxt(siteUrlFor(event));
});
