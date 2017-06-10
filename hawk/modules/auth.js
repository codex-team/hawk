var Crypto = require('crypto');
var mongo = require("./database");
var config = require('../config');

module.exports = (function () {

  var user_id = 0;

  var generateHash = function () {

    string = user_id + config.salt;

    hash = Crypto.createHash('sha256').update(string, 'utf8').digest('hex');

    return hash;

  }

  /**
  * Return user id or 0
  */
  var check = function (cookies) {

    // load cookies
    var uid = getCookies(cookies, 'user_id'),
        uhash = getCookies(cookies, 'user_hash');

    // check if these cookies exist
    if ( !(uid && uhash) ) return 0;

    if (uhash != generateHash(uid)) return 0;

    return uid;

  };

  var getCookies = function (cookies, name) {

    if (!cookies) return undefined;

    var match = cookies.match(new RegExp('\\b'+name+'=([^;]*)'));

    return match ? decodeURIComponent(match[1]) : undefined;

  };

  return {
    check : check,
    generateHash : generateHash
  }

})();
