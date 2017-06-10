module.exports = (function() {

  const websites = 'hawk_websites';

  let getWebsites = function(token, name) {

    return database.findOne(websites, {
      client_token : token,
      name : serverName
    });

  };

  let addEvent = function(collection, events) {

    database.insertOne(collection, events)
      .then(function(){
        return true;
      }).catch(function(){
        return false;
      });
  };

  /**
   * Return if application with name specified is not exists
   */
  let checkDomainName = function(domain) {

    return mongo.findOne(websites, {
      'name': name
    })
      .then(function (result) {
          if (result) {
              return false;
          }
          else {
              return true;
          }
      });
  };

  /**
   * Add new application and token to DB
   */
  let addDomain = function(domain, token) {

    return mongo.insertOne(website, {
      'name' : domain,
      'token' : token
    })
      .then(function (result) {
          return !result;
      });
  }

  return {
    getWebsites : getWebsites,
    addEvent : addEvent,
    checkDomainName : checkDomainName
  };

})();
