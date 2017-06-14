module.exports = (function() {

  'use strict';

  let mongo = require('../modules/database');

  /**
   * Add new event to domain collection
   *
   * @param domain
   * @param event
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

    return mongo.find(domain, query, {time: -1});

  };

  /**
   * Count events by tags (fatal, warnings, notice, javascript)
   *
   * @param domain
   */
  let countTags = function (domain) {
    return mongo.aggregation(domain, [
      {
        $group: {
          _id: '$tag',
          count: {$sum: 1}
        }
      }]);
  };

  /**
   * Get events for all users domains
   *
   * @param user
   * @param query
   * @returns {Promise.<TResult>}
   */
  let getAll = function (user, query) {

    let result = [],
        queries = [];

    if (!user.domains) {
      return Promise.resolve([]);
    }

    user.domains.forEach(function (domain) {
      queries.push(
        get(domain, query)
          .then(function (events) {
            result = result.concat(events);
          })
      );
    });

    return Promise.all(queries)
    .then(function () {
      return result;
    });
  };

  return {
    add: add,
    get: get,
    countTags: countTags,
    getAll: getAll
  };

})();
