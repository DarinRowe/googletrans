const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const acorn = require("acorn");

const projectRoot = path.resolve(__dirname, "..");
const retainPackage = process.argv[2] === "--retain";
if (process.argv.length > 3 || (process.argv[2] && !retainPackage)) {
  throw new Error("Usage: node scripts/test-package.js [--retain]");
}

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

  for (const requiredFile of [
    "package.json",
    "lib/googletrans.js",
    "lib/googletrans.d.ts",
  ]) {
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
  const installedJavaScript = fs
    .readdirSync(path.join(installedPackage, "lib"))
    .filter((file) => file.endsWith(".js"));
  for (const file of installedJavaScript) {
    acorn.parse(
      fs.readFileSync(path.join(installedPackage, "lib", file), "utf8"),
      {
        ecmaVersion: 5,
        sourceType: "script",
      }
    );
  }

  fs.writeFileSync(
    path.join(consumerDirectory, "require-check.js"),
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
      'if (typeof require("googletrans/lib/googleToken").getToken !== "function") {',
      '  throw new Error("googleToken deep export is not callable.");',
      "}",
      'if (typeof require("googletrans/lib/languages").getCode !== "function") {',
      '  throw new Error("languages deep export is not callable.");',
      "}",
      'if (typeof require("googletrans/lib/utils").getUserAgent !== "function") {',
      '  throw new Error("utils deep export is not callable.");',
      "}",
      "",
    ].join("\n")
  );
  run(process.execPath, ["require-check.js"], { cwd: consumerDirectory });

  fs.writeFileSync(
    path.join(consumerDirectory, "type-check.ts"),
    [
      'import googletrans, { getResult, translate } from "googletrans";',
      'import { getToken } from "googletrans/lib/googleToken";',
      'googletrans("hello", { to: "fr" }).then((result) => result.text);',
      'translate("hello", { to: "fr" }).then((result) => result.src);',
      "getResult(null);",
      'getToken("hello");',
      "",
    ].join("\n")
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

  console.log(
    `Verified ES5 library output and CommonJS/TypeScript consumers for ${packResult.filename}.`
  );
} finally {
  fs.rmSync(consumerDirectory, { recursive: true, force: true });
  if (!retainPackage) {
    fs.rmSync(outputDirectory, { recursive: true, force: true });
  }
}
