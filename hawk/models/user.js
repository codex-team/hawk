var auth = require('../modules/auth');
var mongo = require("../modules/database");

module.exports = function () {

  var getUser = function (req) {

    var userId = auth.check(req.cookies);

    return mongo.findOne('users', {_id: mongo.ObjectId(userId)});

  };

  return {
    get: getUser,
  }

}();
