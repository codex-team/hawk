module.exports = function () {

  let mongo = require('../modules/database');
  let email = require('../modules/email');
  let user = require('../models/user');
  let collections = require('../config/collections');

  /**
   * Native Node URL module
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
  let get = function(token, name) {

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
  let checkName = function(domain) {

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

        /** empty string */
        if (!parsedURL.href && !parsedURL.pathname) {
          return;
        }

        return mongo.insertOne(collection, {
          'protocol' : parsedURL.protocol || 'http',
          'name': parsedURL.host || parsedURL.pathname,
          'token': token,
          'user': user._id.toString()
        });

      })
      .then(function (result) {

        if (result) {

          if (process.env.ENVIRONMENT == 'DEVELOPMENT') {

            console.log('Domain: ', domain);
            console.log('Token: ', token);

          } else {

            email.init();
            email.send(
              user.email,
              domain + ' token',
              'Here is an access token for domain ' + domain + ':\n' + token,
              ''
            );

          }

          return true;

        } else {

          return false;

        }

      });
  };

  return {
    get: get,
    checkName: checkName,
    add: add,
    getByUser: getByUser
  };

}();
