// vite.config.js
// Vite configuration - sets up React plugin, Tailwind v4 plugin, and dev server proxy

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Tailwind v4: handled via Vite plugin (no PostCSS needed)
  ],
  server: {
    port: 5173,
    // Proxy /api requests to the Express backend during development
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
