/// <reference types="vitest" />

import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/main.ts"),
      name: "headwind",
      formats: ["es"],
      // the proper extensions will be added
      fileName: "headwind",
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
    // ... Specify options here.
  },
});
