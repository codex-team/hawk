module.exports = function () {

  let mongo = require('../modules/database');
  // let user = require('../models/user');
  let collections = require('../config/collections');

  /**
   * Native Node URL module
   * Use to parse URL's
   * @see https://nodejs.org/api/url.html#url_constructor_new_url_input_base
   */
  const url = require('url');
  const collection = collections.WEBSITES;

  /**
   * Find domain by name and token.
   * Token could be client or server, so we should pass @param type
   *
   * @param token
   * @param name
   */
  let get = function (token, name) {

    return mongo.findOne(collection, {
      token: token,
      name: name
    });

  };

  let getByUser = function (user) {

    return mongo.find(collection, {user: user._id.toString()});

  };

  /**
   * Return true if application with name specified is not exists
   */
  let checkName = function (domain) {

    return mongo.findOne(collection, {
      'name': domain
    })
      .then(function (result) {

        return !result;

      });

  };

  /**
   * Add new domain name and client and server tokens to DB
   */
  let add = function (domain, token, user) {

    return mongo.updateOne('users', {_id: mongo.ObjectId(user._id)}, {$push: {domains: domain}})
      .then(function () {

        /**
         * Using Node URL module to get domain name and protocol
         * to see all features you can in documentation page
         */
        let parsedURL = url.parse(domain);

        /**
         * If hostname isn't valid
         * refresh page with error message
         */
        if (!parsedURL.host && !parsedURL.pathname) {

          throw new Error('Invalid domain name, please try again');

        }

        return mongo.insertOne(collection, {
          'protocol' : parsedURL.protocol || 'http',
          'name': parsedURL.host || parsedURL.pathname,
          'token': token,
          'user': user._id.toString()
        });

      });

  };

  /**
   * Remove domain from database and unlink it from user account
   *
   * @param owner - domain owner
   * @param token - domain token
   * @returns {Promise.<TResult>}
   */
  let remove = function (owner, token) {

    return mongo.findOne(collections.WEBSITES, {
      token: token,
      user: owner._id.toString()
    })
      .then(function (domain) {

        /* Remove domain from list of user`s domains */
        return mongo.updateOne(collections.USERS, {_id: owner._id}, {$pull: {domains: domain}});

      })
      .then(function () {

        /* Remove domain from database */
        return mongo.remove(collections.WEBSITES, {
          user: owner._id.toString(),
          token: token
        });

      })
      .catch(function (e) {

        logger.log('error', 'Can\' remove domain ', e);

      });

  };

  return {
    get: get,
    checkName: checkName,
    add: add,
    getByUser: getByUser,
    remove: remove
  };

}();
