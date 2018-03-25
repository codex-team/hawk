const Crypto = require('crypto');

/**
 * Base Catcher class with unified static methods for catchers.
 */
class BaseCatcher {

  /**
   * Calculate MD5 digest of the input string
   * @param input – data
   */
  static md5 (input) {
    return Crypto.createHash('md5').update(input, 'utf8').digest('hex');
  };

  /**
   * Check if given tag is standard and return default otherwise.
   *
   * @param {String} tag – given tag
   * @param {Array} custom – additional custom tags
   * @param {String} default_tag – default tag if diven tag is not standard
   * @returns {String} tag
   */
  static normalizeTag (tag, custom=[], default_tag='fatal') {
    const tags = [...custom, 'fatal', 'warnings', 'notice'];
    if (tags.indexOf(tag) > -1) {
      return tag;
    } else {
      return default_tag;
    }
  };

  /**
   * Generate text representation of a error stack element (line)
   * Example: /Users/hawk.nodejs/index.js -> 9:15
   *
   * @param {Map} stackElement – stack element structure
   * @returns {string} – string representation
   */
  static getFullDescription (stackElement) {
    return stackElement.file + ' -> ' + stackElement.line + ':' + stackElement.col;
  };

}

module.exports = BaseCatcher;