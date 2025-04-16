import { resolve } from "path";

export default {
  root: resolve(__dirname, "src"),
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    port: 5000,
  },
};
