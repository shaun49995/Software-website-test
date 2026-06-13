import type { Config } from "@react-router/dev/config";

// When STATIC_EXPORT=1 (used by the GitHub Pages workflow) we build a static
// SPA under BASE_PATH. Normal `npm run dev` / `start` stay full SSR.
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.BASE_PATH || "/";

export default {
  ssr: !staticExport,
  basename: basePath,
  future: {
    v8_middleware: true,
    v8_passThroughRequests: true,
    v8_splitRouteModules: true,
    v8_trailingSlashAwareDataRequests: true,
    v8_viteEnvironmentApi: true,
  },
} satisfies Config;
