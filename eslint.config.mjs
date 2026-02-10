import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import cssPlugin from "@eslint/css";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "coverage/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
      "react-hooks": reactHooks,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "react/display-name": "error",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": "off",
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
      reportUnusedInlineConfigs: "warn",
    },
  },
  {
    ...pluginReact.configs.flat.recommended,
    files: ["**/*.{js,jsx,ts,tsx}"],
  },
  {
    ...pluginReact.configs.flat["jsx-runtime"],
    files: ["**/*.{js,jsx,ts,tsx}"],
  },
  {
    files: ["**/*.css"],
    plugins: { css: cssPlugin },
    language: "css/css",
    extends: ["css/recommended"],
  },
]);
