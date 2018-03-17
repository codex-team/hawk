/**
 * Twig extensions
 * @type {*}
 */

let twig = require('twig'),
    fs = require('fs');

module.exports = function () {
  'use strict';

  /**
   * Function for include svg on page
   *
   * @example svg('path/from/root/dir')
   *
   * @param path - path from project root dir
   *
   * TODO: location independence
   *
   * @returns {String} - svg code
   *
   */
  twig.extendFunction('svg', function (path) {
    return fs.readFileSync(__dirname + '/..' + path, 'utf-8');
  });


  /**
   * Function for getting full named event-type
   *
   * @usage {{ event.tag | event-type }}
   *
   * @param eventTag - 'fatal', 'warnings', 'notice' or 'javascript' type of error
   *
   * @returns {String} - full named event-type
   */
  twig.extendFilter('event-type', function (eventTag) {
    switch (eventTag) {
      case 'fatal':
        return 'Fatal Error';
      case 'warnings':
        return 'Warning';
      case 'notice':
        return 'Notice';
      case 'javascript':
        return 'JavaScript Error';
    }
  });

  /**
   * Beautify numbers
   * Add spaces between each three digits in number
   *
   * @usage {{ number|counter }}
   *
   * @example 130000 -> 130 000
   * @example 145000000 -> 145 000 000
   */
  twig.extendFilter('counter', (number) => {
    return twig.filters.number_format(number, [0, ',', ' ']);
  });

  /**
   * Lettering big numbers
   *
   * @usage {{ number|lettered-numbers }}
   *
   * @example 93456 -> 94K
   * @example 8567332 -> 9M
   */
  twig.extendFilter('lettered-numbers', (number) => {
    /**
     * Array of letters by thousands
     * @type {string[]}
     */
    let letters = ['', 'K', 'M', 'G', 'T'];

    /**
     * Iterator for letter's array
     * @type {number}
     */
    let i = 0;

    /**
     * How many digits you want to left after dot
     *
     * @example 0 => 94 К
     * @example 1 => 93.4 К
     * @example 4 => 93.4560 К
     * @type {number}
     */
    let digitsAfterDot = 0;

    while (number >= 1000) {
      number = (number / 1000).toFixed(digitsAfterDot);
      i++;
    }

    return `${number}${letters[i]}`;
  });
}();
