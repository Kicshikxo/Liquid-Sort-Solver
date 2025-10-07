import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],

  server: {
    port: Number(process.env.PORT) || 3000,
  },

  preview: {
    port: Number(process.env.PORT) || 3000,
  },
});
