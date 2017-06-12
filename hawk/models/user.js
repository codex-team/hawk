var auth = require('../modules/auth');
var mongo = require("../modules/database");
var email = require("../modules/email");
var auth = require('../modules/auth');

module.exports = function () {

  var get = function (req) {

    var userId = auth.check(req.cookies);

    return mongo.findOne('users', {_id: mongo.ObjectId(userId)});

  };

  var getByParams = function (params) {

    return mongo.findOne('users', params);

  };

  var add = function (userEmail) {

    password = auth.generatePassword();

    email.init();
    email.send(
      userEmail,
      'Your password',
      "Here it is: " + password,
      ''
    );

    let user = {
      'email': userEmail,
      'password': auth.generateHash(password)
    };

    return mongo.insertOne('users', user)
      .then(function(result) {
        return result.ops[0];
      }).catch(function(err) {
        console.log('Cannot insert user because of %o', err);
      });

  };

  return {
    get: get,
    getByParams: getByParams,
    add: add
  }

}();
