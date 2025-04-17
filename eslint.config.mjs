import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import html from "eslint-plugin-html";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["dist/**", "node_modules/**"], // Ignore dist and node_modules
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Add Node.js globals
      },
    },
    plugins: { js },
    extends: ["js/recommended"], // Combine the "js/recommended" extension here
  },
  {
    // Add support for HTML files
    files: ["**/*.html"],
    plugins: { html },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
]);
