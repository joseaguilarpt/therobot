import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { netlifyPlugin } from "@netlify/remix-adapter/plugin";
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [remix({
    routes: async (defineRoutes) => {
      return defineRoutes((route) => {
        route("/sitemap.xml", "routes/sitemap[.]xml.tsx");
      });
    },
  }), netlifyPlugin(), tsconfigPaths(), visualizer({
    open: true,
    filename: 'dist/stats.html',
  }),],
});
