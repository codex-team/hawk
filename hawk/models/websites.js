module.exports = function () {

  let mongo = require('../modules/database');
  let email = require('../modules/email');
  let user = require('../models/user');
  const collection = 'hawk_websites';

  /**
   * Find domain by name and token.
   * Token could be client or server, so we should pass @param type
   *
   * @param type
   * @param token
   * @param name
   */
  let get = function(type, token, name) {

    switch (type) {
      case 'client':
        return mongo.findOne(collection, {
          client_token: token,
          name: name
        });
      case 'server':
        return mongo.findOne(collection, {
          server_token: token,
          name: name
        });
    }

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
  let add = function (app_name, client_token, server_token, user) {

    return mongo.updateOne('users', {_id: mongo.ObjectId(user)}, {$push: {domains: app_name}}).then(function () {

      return mongo.insertOne(collection, {
          'name': app_name,
          'client_token': client_token,
          'server_token': server_token,
          'user': user
        }
      )
        .then(function (result) {
          if (result) {
            email.init();
            email.send(
              {name: 'CodeX Hawk', email: 'codex.ifmo@yandex.ru'},
              'ntpcp@yandex.ru',
              'Your token',
              'Your client access token: ' + client_token + '\n' + 'Your server access token: ' + server_token,
              '');
            return true;
          }
          else {
            return false;
          }
        });
    })

  };


  return {
    get: get,
    checkName: checkName,
    add: add,
    getByUser: getByUser
  }

}();