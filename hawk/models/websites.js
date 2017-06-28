module.exports = function () {

  let mongo = require('../modules/database');
  let email = require('../modules/email');
  let user = require('../models/user');
  let collections = require('../config/collections');

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

        /** get protocol and domain name */
        let domainInfo = domain.split(/:\/\//),
            protocol = domainInfo[0],
            domainName = domainInfo[1];

        return mongo.insertOne(collection, {
          'protocol' : protocol,
          'name': domainName,
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
