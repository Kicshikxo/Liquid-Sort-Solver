import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",

  resolve: {
    alias: {
      "~": resolve(__dirname, "src"),
    },
  },

  server: {
    port: Number(process.env.PORT) || 3000,
  },

  preview: {
    port: Number(process.env.PORT) || 3000,
  },

  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
