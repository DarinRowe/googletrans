import { defineConfig } from "tsdown";

const sharedUserAgentsPlugin = {
  name: "shared-user-agents",
  generateBundle(outputOptions, bundle) {
    if (outputOptions.format !== "es") {
      return;
    }

    const chunk = bundle["userAgents.mjs"];
    if (chunk?.type === "chunk") {
      chunk.code = [
        'import commonjsModule from "./userAgents.js";',
        "",
        "const { userAgents } = commonjsModule;",
        "",
        "export { userAgents };",
        "",
      ].join("\n");
    }
  },
};

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
  plugins: [sharedUserAgentsPlugin],
  outExtensions({ format }) {
    return format === "cjs"
      ? { js: ".js", dts: ".d.ts" }
      : { js: ".mjs", dts: ".d.mts" };
  },
  clean: true,
  publint: true,
  attw: true,
});
