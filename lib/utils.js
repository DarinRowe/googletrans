"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var agentFile = require("./userAgents.json");
/**
 * Generating a Random User Agent
 * @return {String} - User Agent string
 */
function getUserAgent() {
    // const agentFile = fs.readFileSync("./userAgents.json");
    var browsers = JSON.parse(agentFile)["browsers"];
    var browsersKeys = Object.keys(browsers);
    var browserNmb = getRandom(0, browsersKeys.length - 1);
    var browsersKey = browsersKeys[browserNmb];
    var userAgenLength = browsers[browsersKey].length - 1;
    var userAgentNmb = getRandom(0, userAgenLength);
    return browsers[browsersKey][userAgentNmb];
}
exports.getUserAgent = getUserAgent;
/**
 * Get an integer number between n and m.
 * @param {number} n - Min integer number
 * @param {number} m - Max integer number
 * @returns {number} - random number
 */
function getRandom(n, m) {
    var num = Math.floor(Math.random() * (m - n + 1) + n);
    return num;
}
exports.getRandom = getRandom;
