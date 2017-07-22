let auth = require('../modules/auth');
let mongo = require('../modules/database');
let websites = require('./websites');
let events = require('./events');
let collections = require('../config/collections');

module.exports = function () {
  const collection = collections.USERS;

  let current = function (req) {
    let userId = auth.check(req.cookies);

    return mongo.findOne(collection, {_id: mongo.ObjectId(userId)});
  };

  let get = function (id) {
    return mongo.findOne(collection, {_id: mongo.ObjectId(id)});
  };

  let getByParams = function (params) {
    return mongo.findOne(collection, params);
  };


  /**
   * Check if object with given params already exist in database.
   *
   * @param  {object} param  params dictionary
   * @return {Promise}       True of False
   */
  let checkParamUniqueness = function (param) {
    return new Promise(function (resolve, reject) {
      getByParams(param)
        .then(function (user) {
          if (!user) {
            resolve();
          } else {
            reject();
          }
        })
        .catch(function (e) {
          logger.log('error', 'Can\'t check param uniqueness because of error ', e);
        });
    });
  };

  let add = function (userEmail) {
    let password = auth.generatePassword(),
      passwordHashed = auth.generateHash(password);

    let user = {
      'email': userEmail,
      'password': passwordHashed,
      'domains': [],
      'notifies': {
        'email': true,
        'tg': false,
        'slack': false
      }
    };

    return mongo.insertOne(collection, user)
      .then(function (result) {
        logger.info('Register new user ' + userEmail);

        let insertedUser = result.ops[0];

        return {
          insertedUser,
          password
        };
      }).catch(function (err) {
        logger.log('error', 'Cannot insert user because of ', err);
      });
  };

  /**
   * Get logged user data and his domains data
   *
   * @param req
   * @returns {Promise.<TResult>}
   */
  let getInfo = function (req) {
    let currentUser = null,
      domains = null;

    return current(req)
      .then(function (currentUser_) {
        currentUser = currentUser_;

        if (!currentUser) {
          throw Error(403);
        }

        return websites.getByUser(currentUser);
      })
      .then(function (domains_) {
        domains = domains_;

        let queries = [];

        domains.forEach(function (domain) {
          let query = events.countTags(domain.name)
            .then(function (tags) {
              domain['events'] = {
                'count': 0,
                'unread': 0
              };
              tags.forEach(function (tag) {
                domain[tag._id] = {
                  'count': tag.count,
                  'unread': tag.unread
                };
                domain['events']['count'] += tag.count;
                domain['events']['unread'] += tag.unread;
              });
            }).catch(function (e) {
              logger.error('Events Query composing error: ', e);
            });

          queries.push(query);
        });

        return Promise.all(queries);
      })
      .then(function () {
        return {
          user: currentUser,
          domains: domains
        };
      })
      .catch(function (e) {
        logger.error('Can\'t get user because of ', e);
        return {};
      });
  };

  /**
   * Update user data
   *  - email
   *  - password
   *  - notifies: {
   *      email: {bool}
   *      tg: {bool}
   *      slack: {bool}
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
    getInfo: getInfo,
    update: update,
    checkParamUniqueness: checkParamUniqueness
  };
}();
