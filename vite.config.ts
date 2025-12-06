/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { EsLinter, linterPlugin } from "vite-plugin-linter";
import preload from "vite-plugin-preload";

export default defineConfig((config) => ({
  build: {
    rollupOptions: {
      external: (id) => /\.(test|spec)\.(ts|js)x?$/.test(id),
    },
  },
  test: {
    environment: "jsdom",
    include: ["**/*.{test,spec}.{js,jsx,ts,tsx}"],
    exclude: ["node_modules", "dist", ".git"],
    setupFiles: ["./src/setup.test.ts"],
    coverage: {
      enabled: true,
      provider: "istanbul",
      reportOnFailure: true,
      reporter: ["text"],
      include: ["src/**/*.{js,ts,jsx,tsx}"],
      exclude: [
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/types/*",
        "src/global.d.ts",
        "src/App.test.tsx",
      ],
      all: false,
    },
  },
  plugins: [
    react(),
    linterPlugin({
      include: ["./src/**/*.ts", "./src/**/*.tsx"],
      linters: [
        new EsLinter({
          configEnv: config,
          serveOptions: { clearCacheOnStart: true },
        }),
      ],
      build: {
        includeMode: "filesInFolder",
      },
    }),
    preload({
      mode: "preload",
      includeCss: true,
      includeJs: true,
    }),
  ],
}));
