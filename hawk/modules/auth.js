let Crypto = require('crypto');

module.exports = (function () {

  /* Create sha256 hash for inputString */
  let generateHash = function (inputString) {

    let string = inputString + process.env.SALT;

    let hash = Crypto.createHash('sha256').update(string, 'utf8').digest('hex');

    return hash;

  };

  /* Generate 8 symbols password */
  let generatePassword = function () {

    return Math.random().toString(36).slice(-8);

  };

  /**
  * Checks auth cookies for substitution
  *
  * @param {object} cookies
  * @param {string} cookies.user_id     - id
  * @param {string} cookies.user_hash   - generated token with id + salt
  *
  * @fires @generateHash()
  *
  * @return {number} - user id or 0
  */
  let check = function (cookies) {

    // load cookies
    let uid = cookies.user_id,
        uhash = cookies.user_hash;

    // check if these cookies exist
    if ( !uid || !uhash ) return 0;

    if (uhash != generateHash(uid)) return 0;

    return uid;

  };

  /* Remove cookies */
  let logout = function (res) {

    res.clearCookie('user_id');
    res.clearCookie('user_hash');

  };

  /* Reset cookies */
  let authUser = function (res, user) {

    logout(res);

    let uid = user._id.toString(),
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
