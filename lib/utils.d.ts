/**
 * Generating a Random User Agent
 * @return {String} - User Agent string
 */
declare function getUserAgent(): any;
/**
 * Get an integer number between n and m.
 * @param {number} n - Min integer number
 * @param {number} m - Max integer number
 * @returns {number} - random number
 */
declare function getRandom(n: number, m: number): number;
export { getRandom, getUserAgent };
