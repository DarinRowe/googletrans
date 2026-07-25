import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    googletrans: "src/googletrans.ts",
    googleToken: "src/googleToken.ts",
    languages: "src/languages.ts",
    userAgents: "src/userAgents.ts",
    utils: "src/utils.ts",
  },
  outDir: "lib",
  platform: "node",
  format: ["esm", "cjs"],
  target: "node16",
  dts: true,
  cjsDefault: false,
  outExtensions({ format }) {
    return format === "cjs"
      ? { js: ".js", dts: ".d.ts" }
      : { js: ".mjs", dts: ".d.mts" };
  },
  clean: true,
  publint: true,
  attw: true,
});
