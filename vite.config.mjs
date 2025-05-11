import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

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
    outDir: resolve(__dirname, "dist"),
    target: "esnext",
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
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "../node_modules/bootstrap-icons/font/fonts/*",
          dest: "assets/fonts",
        },
        {
          src: "img/*",
          dest: "img",
        },
      ],
    }),
  ],
};
