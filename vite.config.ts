import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from 'vitest/config';
import tsconfigPaths from "vite-tsconfig-paths";
import { netlifyPlugin } from "@netlify/remix-adapter/plugin";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    // Remix plugin for handling routes and assets
    // This plugin is used to define the routes for the Remix application
    // and to handle the assets during the build process.
    // checkig if the environment is not VITEST
    // to avoid issues with the Remix plugin during testing
    !process.env.VITEST && remix({
      routes: async (defineRoutes) => {
        return defineRoutes((route) => {
          // Root route with optional language parameter
          route(":lang?", "routes/($lang)._index.tsx", { index: true });

          // Other routes with optional language parameter
          route(":lang?/about", "routes/($lang).about.tsx");
          route(":lang?/accessibility", "routes/($lang).accessibility.tsx");
          route(":lang?/blog", "routes/($lang).blog._index.tsx");
          route(":lang?/blog/:blogId", "routes/($lang).blog.$blogId.tsx");
          route(":lang?/ccpa-compliance", "routes/($lang).ccpa-compliance.tsx");
          route(":lang?/contact", "routes/($lang).contact.tsx");
          route(
            ":lang?/convert/:sourceFormat/:targetFormat",
            "routes/($lang).convert.$sourceFormat.$targetFormat.tsx"
          );
          route(":lang?/cookie-policy", "routes/($lang).cookie-policy.tsx");
          route(":lang?/gdpr-compliance", "routes/($lang).gdpr-compliance.tsx");
          route(":lang?/privacy-policy", "routes/($lang).privacy-policy.tsx");
          route(":lang?/terms-of-service", "routes/($lang).terms-of-service.tsx");

          // Special routes (no language parameter)
          route("404", "routes/404.tsx");
          route("error", "routes/Error.tsx");

          // API routes (no language parameter)
          route("manifest.json", "routes/manifest[.]json.ts");
          route("robots.txt", "routes/robots[.]txt.tsx");
          route("sitemap.xml", "routes/sitemap[.]xml.tsx");
          route("blog-sitemap.xml", "routes/blog-sitemap[.]xml.tsx");
        });
      },
    }),
    netlifyPlugin(),
    tsconfigPaths(),
    visualizer({
      open: true,
      filename: "dist/stats.html",
    }),
  ],
   test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupTests.ts',
    exclude: ['**/build/**', '**/node_modules/**', '**/dist/**', '**/app/routes/**'], // 👈 evita rutas Remix
  },
});
