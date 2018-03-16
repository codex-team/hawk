let Project = require('../models/project');
let Events = require('../models/events');
let mongo = require('./database');

class Archiver {

  /**
   * Max number of last events stored in one project's tag
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
     * Get number of events for each tag in target project
     *
     * @type {array}
     * [{ "_id":"javascript", "count":number, "unread":number },
     *  { "_id":"fatal", "count":number, "unread":number },
     *  { "_id":"warnings", "count":number, "unread":number },
     *  { "_id":null, "count":number, "unread":number },
     *  { "_id":"notice", "count":number, "unread":number }]
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
   * @param {Object} tag
   * @param {string} tag._id - name of tag: fatal, warnings, notice, javascript of null
   * @param {int} tag.count - number of events in this tag
   * @param {int} tag.unread - number of unread events
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
    return events.map(event => event._id);
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
