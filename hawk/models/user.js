let auth = require('../modules/auth');
let mongo = require('../modules/database');
let email = require('../modules/email');
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

    let password = auth.generatePassword();

    /** Debug mode */
    if (process.env.ENVIRONMENT == 'DEVELOPMENT') {

      console.log("Your email: ", userEmail);
      console.log("Your password: ", password);

    } else {

      email.init();
      email.send(
        userEmail,
        'Your password',
        'Here it is: ' + password,
        ''
      );

    }

    let user = {
      'email': userEmail,
      'password': auth.generateHash(password),
      'domains': [],
      'notifies': {
        'tg': false,
        'email': false,
        'slack': false
      }
    };

    return mongo.insertOne(collection, user)
      .then(function (result) {

        return result.ops[0];

      }).catch(function (err) {

        logger.log('error', 'Cannot insert user because of %o', err);

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

        return websites.getByUser(currentUser);

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

            }).catch(function (e) {

              logger.log('error', 'Events Query composing error: %o', e);

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

        logger.log('Can\'t get user because of %o', e);

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
    update: update,
    checkParamUniqueness: checkParamUniqueness
  };

}();
