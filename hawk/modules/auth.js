var Crypto = require('crypto');
var mongo = require("./database");

module.exports = (function () {

  var user_id = 0;

  var generateHash = function (user_id) {

    string = user_id + process.env.SALT;

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

  var logout = function (res) {

    res.clearCookie('user_id');
    res.clearCookie('user_hash');

  };

  var authUser = function (res, user) {

    logout(res);

    var uid = user._id.toString(),
        uhash = generateHash(uid);

    res.cookie('user_id', uid);
    res.cookie('user_hash', uhash);

  };

  return {
    check: check,
    generateHash: generateHash,
    authUser: authUser,
    logout: logout
  }

})();
