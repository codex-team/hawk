let Project = require('../models/project');
let Events = require('../models/events');
let mongo = require('./database');

class Archiver {

  /**
   * Max number of events in one project's tag
   *
   * @returns {int}
   */
  get eventsLimit() {
    return 100000;
  }

  /**
   * Remove old events in all projects
   *
   * @returns {Promise<T>}
   */
  async archive() {
    return Project.getAll()
      .then((projects) => {
        return Promise.all(projects.map(async (project) => {
          return await this.removeEventsByProject(project._id);
        }));
      })
      .catch((e) => {
        logger.log('Error while getting count events of all projects:', e);
      })
  }

  /**
   * Remove old events in target project
   *
   * @param {string} projectId
   * @returns {Promise<*>}
   */
  async removeEventsByProject(projectId) {
    /**
     * [{ "_id":"javascript", "count":17396, "unread":17396 },
     *  { "_id":"fatal", "count":139248, "unread":139246 },
     *  { "_id":"warnings", "count":37467, "unread":37466 },
     *  { "_id":null, "count":4, "unread":4 },
     *  { "_id":"notice", "count":35015, "unread":35010 }]
     *
     * @var {array}
     */
    let tags = await Events.countTags(projectId);

    return Promise.all(tags.map(async tag => {
      return await this.archiveEventsByTag(projectId, tag);
    }));
  }

  /**
   * Remove old events for target tag in the project
   *
   * @param {string} projectId
   * @param {array} tag
   * @param {string} tag._id
   * @param {int} tag.count
   * @param {int} tag.unread
   * @returns {Promise<*>|null}
   */
  async archiveEventsByTag(projectId, tag) {
    /**
     * Get number of old events which should be deleted
     *
     * @type {int}
     */
    let needToRemoveThisNumberOfEvents = tag.count - this.eventsLimit;

    if (needToRemoveThisNumberOfEvents > 0) {
      /**
       * Get list of old events
       */
      let oldEvents = await this.getOldEventsIdsInCollectionByTag(projectId, tag._id, needToRemoveThisNumberOfEvents);

      /**
       * Get collection name with events for this project
       */
      let collection = Events.getCollectionName(projectId);

      return await this.removeEvents(collection, oldEvents);
    }
  }

  /**
   * Get list with old events ids in collection with target items limit
   *
   * @param {string} projectId
   * @param {string} tagName
   * @param {int} number
   * @returns {Promise<array>}
   */
  async getOldEventsIdsInCollectionByTag(projectId, tagName, number) {
    /** Get collection name */
    let collectionName = Events.getCollectionName(projectId);

    /** Find items by tag name */
    let query = {
          tag: tagName
        };

    /** Set _id:-1 to get latest items */
    let sort = {};

    /**
     * Get target number of oldest events
     */
    let events = await mongo.find(collectionName, query, sort, number);

    /**
     * Return array of events ids
     */
    return events.map(event => {
      return event._id;
    });
  }

  /**
   * Remove elements from target collection by ids
   *
   * @param {string} collection
   * @param {array} removeIdsArray
   * @returns {Promise<TResult>}
   */
  async removeEvents(collection, removeIdsArray) {
    return await mongo.remove(collection, {_id: {$in: removeIdsArray}});
  }
}

module.exports = Archiver;
