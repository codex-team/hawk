var auth = require('../modules/auth');
var mongo = require("../modules/database");
var auth = require('../modules/auth');
var websites = require('./websites');
var events = require('./events');

module.exports = function () {

  let collection = 'users';

  var current = function (req) {

    var userId = auth.check(req.cookies);

    return mongo.findOne(collection, {_id: mongo.ObjectId(userId)});

  };

  var get = function (id) {

    return mongo.findOne(collection, {_id: mongo.ObjectId(id)});

  };

  var getByParams = function (params) {

    return mongo.findOne(collection, params);

  };

  var add = function (email) {

    password = auth.generatePassword();

    console.log(password);

    let user = {
      'email': email,
      'password': auth.generateHash(password),
      'domains': []
    };

    return mongo.insertOne(collection, user)
      .then(function(result) {
        return result.ops[0];
      });

  };

  /**
   * Get logged user data and his domains data
   *
   * @param req
   * @param res
   * @returns {Promise.<TResult>}
   */
  let getUserAndDomains = function (req, res) {

    let currentUser = null,
        domains = null;

    return current(req)
      .then(function (currentUser_) {

        currentUser = currentUser_;

        if (!currentUser) {
          res.sendStatus(403);
          return;
        }

        return websites.getByUser(currentUser)

      })
      .then(function (domains_) {

        domains = domains_;

        let queries = [];
        domains.forEach(function (domain) {

          let query = events.countTags(domain.name)
              .then(function (tags) {
                tags.forEach(function (tag) {
                  domain[tag._id] = tag.count;
                });
              }).catch(function(e) {
                console.log('Events Query composing error: %o', e);
              });

          queries.push(query);

        });

        return Promise.all(queries);

      })
      .then(function () {

        return {
          user: currentUser,
          domains: domains
        }

      })
      .catch(function (e) {
        console.log('Can\'t get user because of %o', e);
      })
  };

  /**
   * Update user data
   *  - email
   *  - password
   *  - notifies: {
   *      tg: {bool}
   *      slack: {bool}
   *      email: {bool}
   *    }
   *  - tgHook
   *  - slackHook
   *
   *
   * @param user
   * @param params
   * @returns {Promise.<TResult>}
   */
  let update = function (user, params) {

    return getByParams({email: params.email})
      .then(function (foundUser) {
        if (foundUser && foundUser._id.toString() != user._id.toString()) {
          throw Error('Email already registered');
        }
      })
      .then(function () {

        if (params.password) {
          params.password = auth.generateHash(params.password);
        }

        return mongo
          .updateOne(collection,
            {_id: mongo.ObjectId(user._id)},
            {$set: params}
          );

      });

  };

  return {
    current: current,
    getByParams: getByParams,
    add: add,
    get: get,
    getInfo: getUserAndDomains,
    update: update
  }

}();
