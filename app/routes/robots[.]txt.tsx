import { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const robotsTxt = `
# Global rules
User-agent: *
Allow: /

# Explicitly allow blog and language versions
Allow: /blog/
Allow: /en/
Allow: /es/
Allow: /fr/
Allow: /de/
Allow: /pt/
Allow: /nl/
Allow: /it/
Allow: /id/
Allow: /ru/

# Disallow crawling of administrative and private areas
Disallow: /admin/
Disallow: /login
Disallow: /signup
Disallow: /user/
Disallow: /account/
Disallow: /api/
Disallow: /cgi-bin/
Disallow: /tmp/
Disallow: /private/

# Prevent crawling of search result pages
Disallow: /search?
Disallow: /*?s=

# Prevent indexing of file types that shouldn't be in search results
Disallow: /*.pdf$
Disallow: /*.doc$
Disallow: /*.docx$
Disallow: /*.xls$
Disallow: /*.xlsx$
Disallow: /*.ppt$
Disallow: /*.pptx$

# Rules for specific bots
User-agent: Googlebot
Disallow: /nogooglebot/

User-agent: Bingbot
Disallow: /nobingbot/

User-agent: Yandexbot
Disallow: /noyandexbot/

User-agent: Baiduspider
Disallow: /nobaiduspider/

# Sitemaps
Sitemap: https://easyconvertimage.com/sitemap.xml
Sitemap: https://easyconvertimage.com/blog-sitemap.xml

# Crawl-delay directive (optional, adjust as needed)
Crawl-delay: 10

# Additional comments
# Last updated: ${new Date().toISOString().split('T')[0]}
# Contact: theimagesbot@gmail.com
  `.trim();

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain"
    }
  });
};