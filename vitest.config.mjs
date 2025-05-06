import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  // Set the root directory to ./src
  const root = resolve(__dirname, "src");
  // Load environment variables from ./src
  const env = loadEnv(mode, root, "");

  return {
    root, // Set Vitest root directory to ./src
    test: {
      environment: "jsdom",
      exclude: ["**/node_modules/**", "**/e2e/**", "**/dist/**"],
    },
    define: {
      "import.meta.env": env, // Inject env variables into import.meta.env
    },
  };
});
