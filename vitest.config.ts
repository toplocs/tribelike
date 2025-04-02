import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  cacheDir: ".cache/",
  plugins: [
    tailwindcss(),
  ],
});