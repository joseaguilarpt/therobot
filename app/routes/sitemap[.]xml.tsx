import { LoaderFunction, MetaFunction } from "@remix-run/node";
import posts from "../constants/blog/data";

export const meta: MetaFunction = () => {
  return [{ title: "Sitemap" }];
};

export const loader: LoaderFunction = async ({ request }) => {
  const BLOG_POSTS = posts;
  const LANGUAGES = ["en", "es", "pt", "fr", "nl", "de", "it", "id", "ru"];
  const FORMATS = [
    "jpeg",
    "png",
    "gif",
    "webp",
    "avif",
    "tiff",
    "svg",
    "bmp",
    "pdf",
  ];
  const SOURCE_FORMATS = FORMATS.filter((format) => format !== "pdf");

  const STATIC_ROUTES = [
    "/",
    "/about",
    "/accessibility",
    "/ccpa-compliance",
    "/contact",
    "/cookie-policy",
    "/gdpr-compliance",
    "/privacy-policy",
    "/terms-of-service",
    "/blog",
  ];

  function generateRoutes() {
    const routes = [...STATIC_ROUTES];

    // Add blog post routes
    for (const post of BLOG_POSTS) {
      routes.push(`/blog/${post}`);
    }

    // Add conversion routes
    for (const source of SOURCE_FORMATS) {
      for (const target of FORMATS) {
        if (source !== target) {
          routes.push(`/convert/${source}/${target}`);
        }
      }
    }

    return routes;
  }

  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  if (!host) {
    throw new Error("Could not determine domain");
  }
  const protocol = host.includes("localhost") ? "http" : "https";
  const domain = `${protocol}://${host}`;

  const routes = generateRoutes();
  const lastmod = new Date().toISOString();

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${routes
        .flatMap((route) =>
          LANGUAGES.map(
            (lang) => `
          <url>
            <loc>${domain}${lang === "en" ? "" : "/" + lang}${route === "/" ? "" : route}</loc>
            <lastmod>${lastmod}</lastmod>
            ${LANGUAGES.map(
              (altLang) => `
              <xhtml:link 
                 rel="alternate" 
                 hreflang="${altLang}" 
                 href="${domain}${
                altLang === "en" ? "" : "/" + altLang
              }${route}"
              />`
            ).join("")}
          </url>
        `
          )
        )
        .join("")}
    </urlset>
  `.trim();

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8",
      "Content-Length": String(Buffer.byteLength(sitemap)),
      "Cache-Control": "public, max-age=3600",
    },
  });
};
