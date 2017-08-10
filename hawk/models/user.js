let auth = require('../modules/auth');
let mongo = require('../modules/database');
let events = require('./events');
let collections = require('../config/collections');
let project = require('./project');

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
   * Get logged user data and his projects data
   *
   * @param req
   * @returns {Promise.<TResult>}
   */
  let getInfo = function (req) {
    let currentUser = null;

    return current(req)
      .then(function (currentUser_) {
        currentUser = currentUser_;

        if (!currentUser) {
          throw null;
        }

        return project.getByUser(currentUser._id);
      })
      .then(function (projects) {
        let queries = [];

        /**
         * project : {
         *   'events': {
         *     'count': 0,     total number of events for this project
         *     'unread': 0     total number of unread events for this project
         *   },
         *   *event_tag*: {
         *     'count': 0,     number of events fot this *event_tag*
         *     'unread': 0     number of unread events fot this *event_tag*
         *   },
         *   ...
         * }
         */
        projects.forEach(function (currentProject) {
          let query = events.countTags(currentProject.id)
            .then(function (tags) {
              currentProject['events'] = {
                'count': 0,
                'unread': 0
              };
              tags.forEach(function (tag) {
                currentProject[tag._id] = {
                  'count': tag.count,
                  'unread': tag.unread
                };
                currentProject['events']['count'] += tag.count;
                currentProject['events']['unread'] += tag.unread;
              });
            }).catch(function (e) {
              logger.error('Events Query composing error: ', e);
            });

          queries.push(query);
        });

        return Promise.all(queries)
          .then(function () {
            return projects;
          });
      })
      .then(function (projects) {
        return {
          user: currentUser,
          projects: projects
        };
      })
      .catch(function (e) {
        if (e) {
          logger.error('Can\'t get user because of ' + e);
        }
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

  /**
   * Generate new reset hash an save it to db
   *
   * @param userId
   * @returns {Promise.<TResult>}
   */
  let saveRecoverHash = function (userId) {
    let recoverHash = generateRecoverHash();

    return mongo.updateOne(collection,
      {_id: userId},
      {$set: {recoverHash: recoverHash}}
    )
      .then(function () {
        return recoverHash;
      });
  };

  /**
   * Generate random hex string
   * @returns {string} random hash
   */
  let generateRecoverHash = function () {
    return Math.random().toString(16).slice(-12);
  };

  return {
    current: current,
    getByParams: getByParams,
    add: add,
    get: get,
    getInfo: getInfo,
    update: update,
    checkParamUniqueness: checkParamUniqueness,
    saveRecoverHash: saveRecoverHash
  };
}();
