import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import html from "eslint-plugin-html";
import prettier from "eslint-plugin-prettier";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["dist/**", "node_modules/**", "src/docs/**"], // Ignore dist and node_modules
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Add Node.js globals
        bootstrap: "readonly", // Add Bootstrap globals
      },
    },
    plugins: { js }, // Add Prettier to the plugins
    extends: ["js/recommended"], // Use eslint-config-prettier
    rules: {
      "padding-line-between-statements": [
        "error",
        { blankLine: "never", prev: "const", next: "const" },
      ],
      "prettier/prettier": "error", // Run Prettier as an ESLint rule
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
  {
    // Add support for prettier
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    plugins: { prettier },
    rules: {
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          semi: true,
          trailingComma: "all",
          printWidth: 80,
          tabWidth: 2,
          useTabs: false,
        },
      ],
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Add Node.js globals
        bootstrap: "readonly", // Add Bootstrap globals
      },
    },
  },
]);
