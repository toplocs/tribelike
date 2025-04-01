import { defineProject } from "vitest/config";

export default defineProject({
  cacheDir: "../.cache/server",
  test: {
    environment: "node",
  },
});