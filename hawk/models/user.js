var auth = require('../modules/auth');
var mongo = require("../modules/database");
var email = require("../modules/email");
var auth = require('../modules/auth');
var collections = require('../config/collections');

const collection = collections.USERS_COLLECTION_NAME;

module.exports = function () {

  var current = function (req) {

    var userId = auth.check(req.cookies);

    return mongo.findOne('users', {_id: mongo.ObjectId(userId)});

  };

  var get = function (id) {

    return mongo.findOne('users', {_id: mongo.ObjectId(id)});

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
<<<<<<< HEAD
      'email': email,
      'password': auth.generateHash(password),
      'domains': []
=======
      'email': userEmail,
      'password': auth.generateHash(password)
>>>>>>> password-email
    };

    return mongo.insertOne('users', user)
      .then(function(result) {
        return result.ops[0];
      }).catch(function(err) {
        console.log('Cannot insert user because of %o', err);
      });

  };

  return {
    current: current,
    getByParams: getByParams,
    add: add,
    get: get
  }

}();
