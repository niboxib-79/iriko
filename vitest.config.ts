/// <reference types="vitest" />
import { defineConfig } from "vite";
import * as path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
    test: {
        include: ["test/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        globals: true,
        alias: {
            "~": path.resolve(import.meta.dirname, "src")
        }
    },
});
