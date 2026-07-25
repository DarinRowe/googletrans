const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const supportedOptions = new Set(["--live", "--retain"]);
if (
  args.some((arg) => !supportedOptions.has(arg)) ||
  new Set(args).size !== args.length
) {
  throw new Error(
    "Usage: node scripts/test-package.js [--retain] [--live]"
  );
}
const retainPackage = args.includes("--retain");
const testLiveApi = args.includes("--live");

const outputDirectory = retainPackage
  ? path.join(projectRoot, "package-artifacts")
  : fs.mkdtempSync(path.join(os.tmpdir(), "googletrans-pack-"));
const consumerDirectory = fs.mkdtempSync(
  path.join(os.tmpdir(), "googletrans-consumer-")
);
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
    ...options,
  });
}

try {
  if (retainPackage) {
    fs.rmSync(outputDirectory, { recursive: true, force: true });
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  const packResult = JSON.parse(
    run(npmCommand, ["pack", "--json", "--pack-destination", outputDirectory])
  )[0];
  const packedFiles = packResult.files.map((file) => file.path);
  const tarball = path.join(outputDirectory, packResult.filename);
  const publicEntries = [
    "googletrans",
    "googleToken",
    "languages",
    "userAgents",
    "utils",
  ];

  const requiredFiles = ["package.json"];
  for (const entry of publicEntries) {
    requiredFiles.push(
      `lib/${entry}.js`,
      `lib/${entry}.mjs`,
      `lib/${entry}.d.ts`,
      `lib/${entry}.d.mts`
    );
  }

  for (const requiredFile of requiredFiles) {
    if (!packedFiles.includes(requiredFile)) {
      throw new Error(`Package is missing ${requiredFile}.`);
    }
  }

  const forbiddenFile = packedFiles.find(
    (file) =>
      file.startsWith("dist/") ||
      file.startsWith("test/") ||
      file.includes("test-helpers") ||
      file === "webpack.config.js"
  );
  if (forbiddenFile) {
    throw new Error(`Package contains unexpected file ${forbiddenFile}.`);
  }

  fs.writeFileSync(
    path.join(consumerDirectory, "package.json"),
    JSON.stringify({ private: true }, null, 2)
  );
  run(
    npmCommand,
    [
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      "--package-lock=false",
      tarball,
    ],
    { cwd: consumerDirectory }
  );

  const installedPackage = path.join(
    consumerDirectory,
    "node_modules",
    "googletrans"
  );
  for (const file of requiredFiles.filter((file) => file !== "package.json")) {
    if (!fs.existsSync(path.join(installedPackage, file))) {
      throw new Error(`Installed package is missing ${file}.`);
    }
  }

  fs.writeFileSync(
    path.join(consumerDirectory, "require-check.cjs"),
    [
      'const googletrans = require("googletrans");',
      'for (const name of ["default", "googletrans", "translate", "getResult"]) {',
      '  if (typeof googletrans[name] !== "function") {',
      '    throw new Error(`CommonJS export ${name} is not callable.`);',
      "  }",
      "}",
      'if (googletrans.default !== googletrans.googletrans) {',
      '  throw new Error("CommonJS default and named googletrans exports differ.");',
      "}",
      "const deepExports = [",
      '  ["googletrans/lib/googletrans", "default"],',
      '  ["googletrans/lib/googletrans.js", "default"],',
      '  ["googletrans/lib/googleToken", "getToken"],',
      '  ["googletrans/lib/googleToken.js", "getToken"],',
      '  ["googletrans/lib/languages", "getCode"],',
      '  ["googletrans/lib/languages.js", "getCode"],',
      '  ["googletrans/lib/utils", "getUserAgent"],',
      '  ["googletrans/lib/utils.js", "getUserAgent"],',
      '  ["googletrans/lib/userAgents", "userAgents"],',
      '  ["googletrans/lib/userAgents.js", "userAgents"],',
      "];",
      "for (const [path, name] of deepExports) {",
      '  if (typeof require(path)[name] === "undefined") {',
      "    throw new Error(`CommonJS deep export ${path}.${name} is missing.`);",
      "  }",
      "}",
      'if (require("googletrans/package.json").name !== "googletrans") {',
      '  throw new Error("CommonJS package.json export is invalid.");',
      "}",
      "",
    ].join("\n")
  );
  run(process.execPath, ["require-check.cjs"], { cwd: consumerDirectory });

  fs.writeFileSync(
    path.join(consumerDirectory, "import-check.mjs"),
    [
      'import googletrans, { getResult, googletrans as namedGoogletrans, translate } from "googletrans";',
      'import deepGoogletrans from "googletrans/lib/googletrans";',
      'import deepGoogletransWithExtension from "googletrans/lib/googletrans.js";',
      'import { getToken } from "googletrans/lib/googleToken";',
      'import { getToken as getTokenWithExtension } from "googletrans/lib/googleToken.js";',
      'import { getCode } from "googletrans/lib/languages";',
      'import { getCode as getCodeWithExtension } from "googletrans/lib/languages.js";',
      'import { getUserAgent } from "googletrans/lib/utils";',
      'import { getUserAgent as getUserAgentWithExtension } from "googletrans/lib/utils.js";',
      'import { userAgents } from "googletrans/lib/userAgents";',
      'import { userAgents as userAgentsWithExtension } from "googletrans/lib/userAgents.js";',
      "if (googletrans !== namedGoogletrans) {",
      '  throw new Error("ESM default and named googletrans exports differ.");',
      "}",
      "if (googletrans !== deepGoogletrans || googletrans !== deepGoogletransWithExtension) {",
      '  throw new Error("ESM root and deep googletrans exports differ.");',
      "}",
      "for (const [name, value] of Object.entries({",
      "  googletrans,",
      "  translate,",
      "  getResult,",
      "  getToken,",
      "  getTokenWithExtension,",
      "  getCode,",
      "  getCodeWithExtension,",
      "  getUserAgent,",
      "  getUserAgentWithExtension,",
      "})) {",
      '  if (typeof value !== "function") {',
      "    throw new Error(`ESM export ${name} is not callable.`);",
      "  }",
      "}",
      "if (!userAgents || userAgents !== userAgentsWithExtension) {",
      '  throw new Error("ESM userAgents deep exports differ.");',
      "}",
      "",
    ].join("\n")
  );
  run(process.execPath, ["import-check.mjs"], { cwd: consumerDirectory });

  const typeCheckSource = [
    'import googletrans, { getResult, translate } from "googletrans";',
    'import { getToken } from "googletrans/lib/googleToken";',
    'import { getCode } from "googletrans/lib/languages.js";',
    'googletrans("hello", { to: "fr" }).then((result) => result.text);',
    'translate("hello", { to: "fr" }).then((result) => result.src);',
    "getResult(null);",
    'getToken("hello");',
    'getCode("English");',
    "",
  ].join("\n");

  fs.writeFileSync(
    path.join(consumerDirectory, "type-check.ts"),
    typeCheckSource
  );
  run(
    process.execPath,
    [
      path.join(projectRoot, "node_modules", "typescript", "bin", "tsc"),
      "--strict",
      "--noEmit",
      "--module",
      "commonjs",
      "--target",
      "es5",
      "--esModuleInterop",
      "type-check.ts",
    ],
    { cwd: consumerDirectory }
  );

  fs.writeFileSync(
    path.join(consumerDirectory, "type-check.mts"),
    typeCheckSource
  );
  run(
    process.execPath,
    [
      path.join(projectRoot, "node_modules", "typescript", "bin", "tsc"),
      "--strict",
      "--noEmit",
      "--module",
      "nodenext",
      "--target",
      "es2022",
      "type-check.mts",
    ],
    { cwd: consumerDirectory }
  );

  if (testLiveApi) {
    fs.writeFileSync(
      path.join(consumerDirectory, "live-check.mjs"),
      [
        'import googletrans from "googletrans";',
        "",
        "const retryableErrorCodes = new Set([",
        '  "ECONNRESET",',
        '  "ECONNABORTED",',
        '  "ENOTFOUND",',
        '  "ETIMEDOUT",',
        "]);",
        "const retryableStatusCodes = new Set([429, 500, 502, 503, 504]);",
        "",
        "function isRetryable(error) {",
        "  return Boolean(",
        "    error &&",
        "      (retryableErrorCodes.has(error.code) ||",
        "        retryableStatusCodes.has(error.response?.status) ||",
        '        /timeout|socket hang up|network error|temporary/i.test(error.message || ""))',
        "  );",
        "}",
        "",
        "for (let attempt = 1; ; attempt += 1) {",
        "  try {",
        '    const result = await googletrans("hello", { from: "en", to: "es" });',
        '    if (!result || result.src !== "en" || !result.text.trim()) {',
        '      throw new Error("Live API returned an invalid translation result.");',
        "    }",
        "    break;",
        "  } catch (error) {",
        "    if (attempt >= 3 || !isRetryable(error)) {",
        "      throw error;",
        "    }",
        "    await new Promise((resolve) =>",
        "      setTimeout(resolve, 250 * 2 ** (attempt - 1))",
        "    );",
        "  }",
        "}",
        "",
      ].join("\n")
    );
    run(process.execPath, ["live-check.mjs"], { cwd: consumerDirectory });
  }

  console.log(
    `Verified CommonJS, ESM, deep imports, TypeScript consumers${
      testLiveApi ? ", and the live API" : ""
    } for ${packResult.filename}.`
  );
} finally {
  fs.rmSync(consumerDirectory, { recursive: true, force: true });
  if (!retainPackage) {
    fs.rmSync(outputDirectory, { recursive: true, force: true });
  }
}
