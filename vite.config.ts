import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          recharts: ["recharts"],
          "radix-ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-tabs",
            "@radix-ui/react-accordion",
            "@radix-ui/react-select",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-label",
            "@radix-ui/react-separator",
          ],
          vendor: ["react", "react-dom", "wouter", "framer-motion"],
        },
      },
    },
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
