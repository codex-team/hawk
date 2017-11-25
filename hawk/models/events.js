module.exports = (function () {
  'use strict';

  let mongo = require('../modules/database');
  let collections = require('../config/collections');

  const EVENT_STATUS = {
    unread: 0,
    read: 1,
  };

  /**
   * Add new event to project collection
   *
   * @param projectId
   * @param event
   */
  let add = function (projectId, event) {
    /* Status equals 1 if event is read otherwise it equals 0  */
    event.status = EVENT_STATUS.unread;

    let collection = collections.EVENTS + ':' + projectId;

    return mongo.insertOne(collection, event);
  };

  /**
   * Get project events
   *
   * https://docs.mongodb.com/manual/meta/aggregation-quick-reference/
   *
   * @param projectId
   * @param {Object} query  - find params (tag, for example)
   * @param {Boolean} group  - if true, group same events
   * @param {Object|Boolean} sort - sort params, by default sorting by time
   * @param {Number|Boolean} limit - number of events to return
   * @param {Number|Boolean} skip - number of events to skip
   */
  let get = function (projectId, query, group=false, sort=false, limit=false, skip=false) {
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

    let collection = collections.EVENTS + ':' + projectId;

    return mongo.aggregation(collection, pipeline);
  };

  /**
   * Marks as read events from collection by id.
   *
   * @param {String} collection - collection name
   * @param groupHash
   * @returns {Promise.<TResult>}
   */
  let markRead = function (collection, groupHash) {
    return mongo.updateMany(
      collection,
      { groupHash: groupHash },
      { $set: { 'status': EVENT_STATUS.read } }
    );
  };

  /**
   * Count events by tags (fatal, warnings, notice, javascript)
   *
   * @param projectId
   */
  let countTags = function (projectId) {
    let collection = collections.EVENTS + ':' + projectId;

    return mongo.aggregation(collection, [
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
   * Get events for all users projects
   *
   * @param user
   * @param query
   * @param limit
   * @param skip
   * @returns {Promise.<TResult>}
   */
  let getAll = function (user, query, limit=false, skip=false) {
    let result = [],
        queries = [];

    if (!user.projects) {
      return Promise.resolve([]);
    }

    user.projects.forEach(function (project) {
      queries.push(
        get(project.id, query, true, false, limit, skip)
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
