import { sitemapXml } from "../lib/seo";

export default defineEventHandler((event) => {
  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  return sitemapXml(siteUrlFor(event));
});
