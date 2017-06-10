var Crypto = require('crypto');
var Cookies = require('./cookies');

module.exports = (function () {

  /* Create sha256 hash for inputString */
  var generateHash = function (inputString) {

    string = inputString + process.env.SALT;

    hash = Crypto.createHash('sha256').update(string, 'utf8').digest('hex');

    return hash;

  }

  /* Generate 8 symbols password */
  var generatePassword = function () {

    return Math.random().toString(36).slice(-8);

  }

  /* Return user id or 0 */
  var check = function (cookies) {

    // load cookies
    var uid = Cookies(cookies, 'user_id'),
        uhash = Cookies(cookies, 'user_hash');

    // check if these cookies exist
    if ( !uid || !uhash ) return 0;

    if (uhash != generateHash(uid)) return 0;

    return uid;

  };

  /* Remove cookies */
  var logout = function (res) {

    res.clearCookie('user_id');
    res.clearCookie('user_hash');

  };

  /* Reset cookies */
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
    generatePassword: generatePassword,
    authUser: authUser,
    logout: logout
  }

})();
