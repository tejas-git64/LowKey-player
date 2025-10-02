/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import preload from "vite-plugin-preload";

export default defineConfig({
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
      ],
      all: false,
    },
  },
  plugins: [
    react(),
    preload({
      mode: "preload",
      includeCss: true,
      includeJs: true,
    }),
  ],
});
