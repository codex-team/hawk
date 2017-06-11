module.exports = (function() {

  let mongo = require('../modules/database');
  let user = require('./user');

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

  let countTags = function (domain) {
    return mongo.aggregation(domain, [
      {
        $group: {
          _id: "$tag",
          count: {$sum: 1}
        }
      }])
  };

  let getAll = function (user, query) {

    let result = [];
    let queries = [];
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
