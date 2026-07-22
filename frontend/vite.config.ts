// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from 'path';
import fs from 'fs';

// Safely load root .env in local dev if present
const envPath = path.resolve(process.cwd(), '../.env');
if (fs.existsSync(envPath)) {
  try {
    const dotenv = await import('dotenv');
    dotenv.default?.config({ path: envPath }) || dotenv.config?.({ path: envPath });
  } catch {
    // Ignore if dotenv is not installed in production/CI environments
  }
}
import Sitemap from "vite-plugin-sitemap";
import { imagetools } from "vite-imagetools";
import { compression } from "vite-plugin-compression2";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  nitro: {
    cloudflare: {
      nodeCompat: true
    },
    alias: {
      "node:fs": "./src/backend/shared/mock-proxy.ts",
      "node:fs/promises": "./src/backend/shared/mock-proxy.ts",
      "node:http": "./src/backend/shared/mock-proxy.ts",
      "node:zlib": "./src/backend/shared/mock-proxy.ts",
      "node:child_process": "./src/backend/shared/mock-proxy.ts",
      "node:timers": "./src/backend/shared/mock-proxy.ts",
      "node:timers/promises": "./src/backend/shared/mock-proxy.ts"
    }
  },

  tanstackStart: {
    server: { entry: "server" },
    serverFns: { disableCsrfMiddlewareWarning: true },
  },
  vite: {
    plugins: [
      Sitemap({
        hostname: "https://www.shailrajtravels.com",
        dynamicRoutes: [
          "/tours/ashtavinayak-yatra",
          "/tours/jyotirlinga-darshan",
          "/tours/pandharpur-wari",
          "/tours/char-dham-yatra",
          "/tours/shirdi-tour",
          "/tours/tirupati-balaji-tour",
        ],
      }),
      imagetools(),
      visualizer({ filename: "bundle-stats.html", template: "treemap" }),
    ],
    optimizeDeps: {
      exclude: ["@aws-sdk/client-s3", "@open-wa/wa-automate", "puppeteer-core", "puppeteer", "pdfkit"],
    },
    ssr: {
      external: ["@puppeteer/browsers", "@open-wa/wa-automate", "puppeteer-core", "puppeteer", "pdfkit", "@aws-sdk/client-s3", "http-auth", "buffer-crc32"],
    },
    server: {
      host: true,
      watch: {
        ignored: ["**/.wwebjs_auth/**", "**/.wwebjs_cache/**"],
      },
    },
    build: {
      rollupOptions: {
        external: ["@aws-sdk/client-s3"],
      },
    },
  },
});
