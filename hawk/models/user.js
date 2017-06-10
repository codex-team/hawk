var auth = require('../modules/auth');
var mongo = require("../modules/database");
var auth = require('../modules/auth');

module.exports = function () {

  var get = function (req) {

    var userId = auth.check(req.cookies);

    return mongo.findOne('users', {_id: mongo.ObjectId(userId)});

  };

  var getByParams = function (params) {

    return mongo.findOne('users', params);

  };

  var add = function (email) {

    password = auth.generatePassword();

    console.log(password);

    let user = {
      'email': email,
      'password': auth.generateHash(password)
    };

    return mongo.insertOne('users', user)
      .then(function(result) {
        return result.ops[0];
      });

  };

  return {
    get: get,
    getByParams: getByParams,
    add: add
  }

}();
