import { resolve } from "path";

export default {
  root: resolve(__dirname, "src"),
  resolve: {
    alias: {
      "~bootstrap": resolve(__dirname, "node_modules/bootstrap"),
      "~bootstrap-icons": resolve(__dirname, "node_modules/bootstrap-icons"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true, // Suppress deprecation warnings for dependencies
      },
    },
  },
  server: {
    port: 5000,
    open: true,
  },
  build: {
    rollupOptions: {
      external: ["bootstrap"], // Mark Bootstrap as an external dependency
    },
    outDir: resolve(__dirname, "../dist"),
    emptyOutDir: true,
  },
};
