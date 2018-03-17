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
   * @usage {{ events|counter }}
   *
   * @example 130000 -> 130 000
   * @example 145000000 -> 145 000 000
   */
  twig.extendFilter('counter', (number) => {
    return twig.filters.number_format(number, [0, ',', ' ']);
  })
}();
