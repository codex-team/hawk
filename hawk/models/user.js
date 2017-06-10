var auth = require('../modules/auth');

module.exports = function () {

  var getUser = function (req) {

    var userId = auth.check(req.cookies);

    return userId;

  };

  return {
    get: getUser,
  }

}();
