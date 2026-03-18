import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/**/*.ts"],
  unbundle: true,
  hash: false,
  platform: "node",
});