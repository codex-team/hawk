module.exports = (function () {
  'use strict';

  const mongo = require('../modules/database');
  const collections = require('../config/collections');

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

    let collection = getCollectionName(projectId);

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

    let collection = getCollectionName(projectId);

    return mongo.aggregation(collection, pipeline);
  };

  /**
   * Get number of events in collection by query
   *
   * @param {string} projectId
   * @param {object} query
   * @return {Promise<Number>}
   */
  let getCount = function (projectId, query) {
    let collection = getCollectionName(projectId);

    return mongo.count(collection, query);
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
   * @typedef {string|null} tagName - 'javascript|fatal|warnings|notice'
   *
   * @param {string} projectId
   * @param {boolean} includeArchived - is need to sum archived events count
   * @return {{_id: tagName, count:number, unread:number }[]}
   */
  let countTags = async function(projectId, includeArchived = true) {
    let collection = getCollectionName(projectId);

    let events = await mongo.aggregation(collection, [
      {
        $group: {
          _id: '$tag',
          count: {$sum: 1},
          /* To count unread events, we compare status with 1 for each one */
          unread: {$sum: {$cmp: [EVENT_STATUS.read, '$status']}}
        }
      }
    ]);

    if (!includeArchived) {
      return events;
    }

    /**
     * Count archived items too
     */
    let archivedEvents = await getArchivedEventsCounters(projectId);

    events = events.map((event) => {
      /**
       * Get number of archived items and sum it with saved items by tag
       */
      archivedEvents.forEach((archivedEvent) => {
        if (archivedEvent.tag === event._id) {
          event.count += archivedEvent.archived;
          event.archived = archivedEvent.archived;
        }
      });

      return event;
    });

    return events;
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

  /**
   * Get name for events collection by projectId
   *
   * @param {string} projectId
   * @return {string}
   */
  let getCollectionName = (projectId) => {
    return collections.EVENTS + ':' + projectId;
  };

  /**
   * Get archived events counters
   *
   * @param {string} projectId
   * @returns {Promise<{_id:string, project:string, tag:tagName, archived:number }[]>}
   */
  let getArchivedEventsCounters = async (projectId) => {
    let query = {
      project: projectId
    };

    try {
      return await mongo.find(collections.ARCHIVE, query);
    } catch (e) {
      logger.log('Error while getting archived events', e);
    }
  };

  return {
    add,
    get,
    countTags,
    getCount,
    getAll,
    markRead,
    getCollectionName
  };
})();
