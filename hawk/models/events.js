module.exports = (function () {
  'use strict';

  let mongo = require('../modules/database');

  const EVENT_STATUS = {
    unread: 0,
    read: 1,
  };

  /**
   * Add new event to domain collection
   *
   * @param domain
   * @param event
   */
  let add = function (domain, event) {
    /* Status equals 1 if event is read otherwise it equals 0  */
    event.status = EVENT_STATUS.unread;
    return mongo.insertOne(domain, event);
  };

  /**
   * Get domain events
   *
   * https://docs.mongodb.com/manual/meta/aggregation-quick-reference/
   *
   * @param {string} domain - domain name
   * @param {object} query  - find params (tag, for example)
   * @param {bool} group  - if true, group same events
   * @param {object} sort - sort params, by default sorting by time
   * @param {number} limit - number of events to return
   * @param {number} skip - number of events to skip
   */
  let get = function (domain, query, group, sort, limit, skip) {
    let pipeline = [
      {$match: query}
    ];

    if (group) {
      pipeline.push({$group: {
        _id: '$groupHash',
        type: {$first: '$type'},
        tag: {$first: '$tag'},
        errorLocation: {$first: '$errorLocation'},
        message: {$first: '$message'},
        time: {$last: '$time'},
        count: {$sum: 1},
        status: {$min: '$status'}
      }});
    }

    if (!sort) {
      sort = {
        time: -1
      };
    }

    pipeline.push({
      $sort: sort
    });

    if (skip) {
      pipeline.push({
        $skip: skip
      });
    }

    if (limit) {
      pipeline.push({
        $limit: limit
      });
    }

    return mongo.aggregation(domain, pipeline);
  };

  /**
   * Marks as read events from collection by id.
   *
   * @param {String} collection - collection name
   * @param {Array} eventsIds - array of id
   * @returns {Promise.<TResult>}
   */
  let markRead = function (collection, eventsIds) {
    return mongo.updateMany(
      collection,
      { _id: { $in: eventsIds } },
      { $set: { 'status': EVENT_STATUS.read } },
      { upsert: true }
    );
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
          count: {$sum: 1},
          /* To count unread events, we compare status with 1 for each one */
          unread: {$sum: { $cmp: [EVENT_STATUS.read, '$status']}}
        }
      } ]);
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
    getAll: getAll,
    markRead: markRead
  };
})();
