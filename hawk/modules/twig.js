/**
 * Twig extensions
 * @type {*}
 */

let twig = require('twig'),
    fs = require('fs'),
    Crypto = require('crypto');


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
   * sha256 filter. Encode input string using sha256 algorithm
   *
   * @param {String} string — string to encode
   * @param {Boolean} useSalt — if true, append salt to string
   *
   * @returns {String} — encoded string
   **/
  twig.extendFilter('sha256', function (string, useSalt=true) {

    if (useSalt) {
      string = string + process.env.SALT;
    }

    let hash = Crypto.createHash('sha256').update(string, 'utf8').digest('hex');

    return hash;

  })

}();
