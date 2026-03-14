import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/**/*.ts"],
  unbundle: true,
  hash: false,
});
