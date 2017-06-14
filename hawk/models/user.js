var auth = require('../modules/auth');
var mongo = require("../modules/database");
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

  var add = function (email) {

    password = auth.generatePassword();

    console.log(password);

    let user = {
      'email': email,
      'password': auth.generateHash(password),
      'domains': []
    };

    return mongo.insertOne('users', user)
      .then(function(result) {
        return result.ops[0];
      });

  };

  return {
    current: current,
    getByParams: getByParams,
    add: add,
    get: get
  }

}();
