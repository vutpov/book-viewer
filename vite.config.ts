import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      dts({
        include: ["./src/**/*.{ts,tsx}", "./src/index.tsx"],
        exclude: ["./src/stories"],
      }),
      react(),
    ],
    resolve: {
      alias: {
        // Alias for the root directory
        "/@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/index.tsx"),
        name: "@cubetiq/enhance-antd-table",
        fileName: "index",
        sourcemap: true,
        formats: ["es", "cjs"],
      },
      rollupOptions: {
        external: ["react", "react/jsx-runtime", "react-dom"],
      },
      outDir: "dist",
    },
    target: "esnext",
    css: {
      preprocessorOptions: {
        less: {
          math: "always",
          relativeUrls: true,
          javascriptEnabled: true,
        },
      },
    },
  };
});
