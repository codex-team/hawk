module.exports = (function() {

  let mongo = require('../modules/database');

  /**
   * Add new event to domain collection
   *
   * @param domain
   * @param events
   */
  let add = function(domain, event) {

    return mongo.insertOne(domain, event);

  };

  /**
   * Get domain events by query
   *
   * @param domain
   * @param query
   */
  let get = function (domain, query) {

    return mongo.find(domain, query);

  };

  return {
    add: add,
    get: get
  };

})();
