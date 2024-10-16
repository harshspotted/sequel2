import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dotenv from "dotenv";
import { rm } from "fs/promises";
dotenv.config({ path: ".env" });
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist", // Specify the output directory
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
      plugins: [
        {
          name: "remove-gyp-path",
          buildEnd: async () => {
            const gypPath = path.join(
              __dirname,
              "node_modules",
              "fs-xattr",
              "build",
              "node_gyp_bins"
            );
            await rm(gypPath, { recursive: true, force: true });
          },
        },
      ],
    },
  },
  server: {
    port: 3000, // Specify the development server port
  },
  // Additional configuration for Electron
  define: {
    "process.env.REACT_APP_GROQ_API_KEY": JSON.stringify(
      process.env.REACT_APP_GROQ_API_KEY
    ),
    "process.env.REACT_APP_OPENAI_API_KEY": JSON.stringify(
      process.env.REACT_APP_OPENAI_API_KEY
    ),
    // Define process.env for compatibility
  },
});
