import { defineWorkspace } from "vitest/config";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

const workspaces = pkg.workspaces
.filter((name: string) => !["scripts"].includes(name))
.map((name: string) => ({
  extends: `./${name}/vite.config.ts`,
  test: {
    root: `./${name}`,
    name: name,
  },
}));

export default defineWorkspace(
  workspaces
);