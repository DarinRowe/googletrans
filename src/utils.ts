const agentFile = require("../config/userAgents.json");

/**
 * Generating a Random User Agent
 * @return {String} - User Agent string
 */
function getUserAgent() {
  // const agentFile = fs.readFileSync("../config/userAgents.json");
  const browsers = JSON.parse(agentFile)["browsers"];
  const browsersKeys = Object.keys(browsers);
  const browserNmb = getRandom(0, browsersKeys.length - 1);
  const browsersKey = browsersKeys[browserNmb];
  const userAgenLength = browsers[browsersKey].length - 1;
  const userAgentNmb = getRandom(0, userAgenLength);
  return browsers[browsersKey][userAgentNmb];
}

/**
 * Get an integer number between n and m.
 * @param {number} n - Min integer number
 * @param {number} m - Max integer number
 * @returns {number} - random number
 */
function getRandom(n: number, m: number) {
  var num = Math.floor(Math.random() * (m - n + 1) + n);
  return num;
}

export { getRandom, getUserAgent };
