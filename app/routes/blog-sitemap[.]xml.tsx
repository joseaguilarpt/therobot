import { LoaderFunction } from "@remix-run/node";
import posts from "../constants/blog/data";

export const loader: LoaderFunction = async ({ request }) => {
  const BLOG_POSTS = Object.keys(posts);
  const LANGUAGES = ["en", "es", "pt", "fr", "nl", "de", "it", "id", "ru"];

  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  if (!host) {
    throw new Error("Could not determine domain");
  }
  const protocol = host.includes("localhost") ? "http" : "https";
  const domain = `${protocol}://${host}`;

  const lastmod = new Date().toISOString();

  const blogSitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${BLOG_POSTS.flatMap((post) =>
        LANGUAGES.map(
          (lang) => `
        <url>
          <loc>${domain}${lang === "en" ? "" : "/" + lang}/blog/${post}</loc>
          <lastmod>${lastmod}</lastmod>
          ${LANGUAGES.map(
            (altLang) => `
            <xhtml:link 
               rel="alternate" 
               hreflang="${altLang}" 
               href="${domain}${altLang === "en" ? "" : "/" + altLang}/blog/${post}"
            />`
          ).join("")}
        </url>
      `
        )
      ).join("")}
    </urlset>
  `.trim();

  return new Response(blogSitemap, {
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8",
      "Content-Length": String(Buffer.byteLength(blogSitemap)),
      "Cache-Control": "public, max-age=3600",
    },
  });
};