import path from "path";

export default {
  root: path.resolve(__dirname, "src"),
  resolve: {
    alias: {
      "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
      "~bootstrap-icons": path.resolve(
        __dirname,
        "node_modules/bootstrap-icons",
      ),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
};
