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
        bootstrap: "readonly", // Add Bootstrap globals
      },
    },
    plugins: { js },
    extends: ["js/recommended"], // Combine the "js/recommended" extension here
    rules: {
      // Add the padding-line-between-statements rule
      "padding-line-between-statements": [
        "error",
        { blankLine: "never", prev: "const", next: "const" },
      ],
    },
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
