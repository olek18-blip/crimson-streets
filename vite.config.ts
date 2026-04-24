import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      checks: {
        pluginTimings: false,
      },
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (id.includes("@react-three/fiber")) return "r3f-core";
          if (id.includes("@react-three/drei")) return "r3f-drei";
          if (id.includes("three/examples")) return "three-examples";
          if (id.includes("node_modules/three")) return "three-core";
          if (id.includes("@radix-ui")) return "radix-ui";
          if (id.includes("react-router-dom")) return "react-router";
          if (id.includes("react-dom") || id.includes("react/jsx")) return "react-dom";
          if (id.includes("node_modules/react")) return "react";
          if (id.includes("@tanstack")) return "tanstack";

          return "vendor";
        },
      },
    },
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
