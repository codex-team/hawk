/**
 * Utils and methods
 */

let Crypto = require('crypto');

/**
 * Generate MD5 digest
 * @param {string} input
 * @return {string}
 */
module.exports.md5 = function (input) {
  return Crypto.createHash('md5').update(input, 'utf8').digest('hex');
};