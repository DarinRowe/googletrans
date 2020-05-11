/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");

module.exports = {
  entry: "./lib/googletrans.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "googletrans.js",
    // sourceMapFilename: "googletrans.map",
    libraryTarget: "umd",
  },
};
