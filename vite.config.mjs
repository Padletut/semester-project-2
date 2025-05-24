import { resolve } from "path";

export default {
  root: resolve(__dirname, "src"),
  publicDir: resolve(__dirname, "public"),
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
    outDir: resolve(__dirname, "dist"),
    target: "esnext",
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        authorization: resolve(__dirname, "src/authorization.html"),
        detail: resolve(__dirname, "src/detail.html"),
        profile: resolve(__dirname, "src/profile.html"),
      },
    },
    emptyOutDir: true,
  },
};
