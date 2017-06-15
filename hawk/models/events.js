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
   * Get domain events
   *
   * @param {string} domain - domain name
   * @param {object} query  - find params (tag, for example)
   * @param {bool} group  - if true, group same events
   * @param {object} sort - sort params, by default sorting by time
   * @param {number} skip - number of events to skip
   * @param {number} limit - number of events to return
   */
  let get = function (domain, query, group, sort, limit, skip) {

    let pipline = [
      {$match: query}
    ];

    if (group) {
      pipline.push({$group: {
        _id: "$stack",
        type: {$first: "$type"},
        tag: {$first: "$tag"},
        stack: {$first: "$stack"},
        errorLocation: {$first: "$errorLocation"},
        message: {$first: "$message"},
        time: {$last: "$time"},
        count: {$sum: 1}
      }})
    }

    if (!sort) {
      sort = {
        time: -1
      }
    }

    pipline.push({
      $sort: sort
    });

    if (skip) {
      pipline.push({
        $skip: skip
      })
    }

    if (limit) {
      pipline.push({
        $limit: limit
      })
    }


    return mongo.aggregation(domain, pipline)

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
