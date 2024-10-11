import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.js",
  },
  build: {
    rollupOptions: {
      external: ["react"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
});
