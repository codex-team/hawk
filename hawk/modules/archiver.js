const Project = require('../models/project');
const Events = require('../models/events');
const mongo = require('./database');
const collections = require('../config/collections');

class Archiver {

  /**
   * Max number of last events stored in one project's tag
   *
   * @returns {int}
   */
  static get eventsLimit() {
    return 10000;
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
          /**
           * @type {number[]} - list of counters for each tag
           */
          let removedEventsFromProjectTags = await this.removeEventsByProject(project._id);

          /**
           * Summ total counter for all tags in Project
           */
          let projectTotalArchivedCounter = removedEventsFromProjectTags.reduce((prev, cur) => {
            return cur ? prev + cur : prev;
          }, 0);

          return {
            projectId: project._id,
            projectName: project.name,
            archived: projectTotalArchivedCounter
          };
        }));
      })
      .then(
        /**
         * @param  {{projectId: string, projectName: string, archived: number}[]} removed
         */
        function(removed){
          return removed;
        }
      )
      .catch((e) => {
        logger.log('Error while getting count events of all projects:', e);
        global.catchException(e);
      });
  }

  /**
   * Remove old events in target project
   *
   * @param {string} projectId
   * @returns {Promise<number[]>} - removed counters array
   */
  async removeEventsByProject(projectId) {
    /**
     * Get number of events for each tag in target project
     *
     * @typedef {string|null} tagName - 'javascript|fatal|warnings|notice'
     *
     * @type {{_id: tagName, count:number, unread:number }[]}
     */
    let tags = await Events.countTags(projectId, false);

    return Promise.all(tags.map(async tag => {
      try {
        return await this.archiveEventsByTag(projectId, tag)

      } catch (e) {
        logger.log('Archiver: error while getting last event of olders', e);
        global.catchException(e);
        return 0;
      }
    }));
  }

  /**
   * Remove old events for target tag in the project
   *
   * @param {string} projectId
   * @param {Object} tag
   * @param {string} tag._id - name of tag: fatal, warnings, notice, javascript of null
   * @param {number} tag.count - number of events in this tag
   * @param {number} tag.unread - number of unread events
   * @returns {Promise<number>} - count of removed items
   */
  async archiveEventsByTag(projectId, tag) {
    /**
     * Get tag name
     * @type {string}
     */
    let tagName = tag._id;

    /**
     * Get number of old events which should be deleted
     *
     * @type {int}
     */
    let needToRemoveThisNumberOfEvents = tag.count - Archiver.eventsLimit;

    /**
     * Check if there are staled events
     */
    if (needToRemoveThisNumberOfEvents <= 0) {
      return;
    }

    /**
     * Get the newest event in the list of old events
     */
    let lastEventToArchive = await this.getLastEventOfOlders(projectId, tagName, needToRemoveThisNumberOfEvents);

    if (!lastEventToArchive){
      return;
    }

    /**
     * Mongo _id of the last event
     * @type {string}
     */
    let eventId = lastEventToArchive._id;

    /**
     * Get collection name with events for this project
     */
    let collection = Events.getCollectionName(projectId);

    let removedItems = await this.removeEvents(collection, tagName, eventId);
    let removedItemsCount = removedItems ? removedItems.result.n : 0;

    /**
     * Save archived items count
     */
    await this.saveArchivedCount({
      tag: tagName,
      removedCount: removedItemsCount,
      projectId: projectId
    });

    return removedItemsCount;
  }

  /**
   * Get list with old events in collection with target items limit
   *
   * @param {string} projectId
   * @param {string} tagName
   * @param {int} number
   * @returns {Promise<array|null>}
   */
  async getLastEventOfOlders(projectId, tagName, number) {
    /** Get collection name */
    let collectionName = Events.getCollectionName(projectId);

    /** Find items by tag name */
    let query = {
      tag: tagName
    };

    /**
     * For getting the newest element in the list of old then
     * we will skip all elements in limit except one
     */
    let sort = {};
    let limit = 1;
    let skip = number - 1;

    /**
     * Return the last event of old events
     */
    try{
      let lastEvent = await mongo.find(collectionName, query, sort, limit, skip);

      return lastEvent.length ? lastEvent.shift() : null;
    } catch (e) {
      global.catchException(e);
      logger.log('Archiver: error while getting last event of olders', e);
    }
  }

  /**
   * Remove old elements from collection
   * it their time is lower that target timestamp
   *
   * @param {string} collection
   * @param {string} tagName
   * @param {string} eventId
   * @returns {Promise<TResult>}
   */
  async removeEvents(collection, tagName, eventId) {
    let query = {
      _id: {$lte: mongo.ObjectId(eventId)},
      tag: tagName
    };

    return await mongo.remove(collection, query);
  }

  /**
   *
   * @param projectId
   * @param tag
   * @param removedCount
   * @returns {Promise<TResult>}
   */
  async saveArchivedCount({projectId, tag, removedCount}) {
    logger.log(`Archiver: archived ${removedCount} events from Project ${projectId}`);

    let query = {
      project: projectId,
      tag: tag
    };

    let update = {
      $set: {
        project: projectId,
        tag: tag
      },
      $inc: {
        archived: removedCount
      }
    };

    let options = {
      upsert: true
    };

    return await mongo.updateMany(collections.ARCHIVE, query, update, options);
  }
}

module.exports = Archiver;
