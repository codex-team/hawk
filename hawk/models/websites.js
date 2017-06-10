module.exports = function () {

  let mongo = require('../modules/database');
  const websites = 'hawk_websites';

  let get = function(type, token, name) {

    switch (type) {
      case 'client':
        return mongo.findOne(websites, {
          client_token: token,
          name: name
        });
      case 'server':
        return mongo.findOne(websites, {
          server_token: token,
          name: name
        });
    }

  };

  /**
   * Return if application with name specified is not exists
   */
  let checkName = function(domain) {

    return mongo.findOne(websites, {
      'name': domain
    })
      .then(function (result) {
        return !result;
      });
  };

  /**
   * Add new application and token to DB
   */
  let add = function (app_name, client_token, server_token) {

    return mongo.insertOne(websites, {
        'name': app_name,
        'client_token': client_token,
        'server_token': server_token
      }
    )
      .then(function (result) {
        if (result) {
          email.init();
          email.send(
            {name:'CodeX Hawk', email:'codex.ifmo@yandex.ru'},
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
  };


  return {
    get: get,
    checkName: checkName,
    add: add
  }

}();