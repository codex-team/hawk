'use strict';

const express = require('express');
const router = express.Router();
const modelEvents = require('../../models/events');
const mongo = require('../../modules/database');
const collections = require('../../config/collections');
const archiver = require('../../modules/archiver');

/**
 * limit count of events per page
 */
const EVENT_LIMIT = 10;


/**
 * Check if user can manage passed domain.
 * Returns project's data object or null
 *
 * @param {array} userProjects
 * @param {string} projectUri
 *
 * @return {Object|null}
 */
let getProjectInfo = (userProjects, projectUri) => {
  for (let i = 0; i < userProjects.length; i++) {
    if (userProjects[i].user.projectUri === projectUri) {
      return userProjects[i];
    }
  }

  return null;
};

/**
 * Marks all events in list as read
 * @param currentProject
 * @param {Array} events - events list
 */
let markEventsAsRead = function (currentProject, events) {
  let  collection = collections.EVENTS + ':' + currentProject.id;

  return modelEvents.markRead(collection, events[0].groupHash)
    .then(function () {
      return events;
    });
};

/**
 * Global request handler
 * Calls in current Request and Response context via necessary data
 * Delegates request into separate functions that has their own response
 *
 * @typedef {Object} GarageResponseContext
 * @type {Object} req - Request
 * @type {Object} res - Response
 *
 * @this {Object} GarageResponseContext
 *
 * @param {Object} currentProject
 * @param {Array} events
 * @param {Boolean} canLoadMore
 * @param {number} eventsCount - total number of events in this group
 * @return {String}
 * @private
 */
let makeResponse_ = function  (currentProject, events, canLoadMore, eventsCount) {
  /**
   * work with current request context
   * context:
   *  - Request
   *  - Response
   */
  let context = this;

  let request = context.req,
    response = context.res,
    isAjaxRequest = request.xhr,
    templatePath = 'garage/events/' + events[0].type;

  /** requiring page via AJAX */
  if (isAjaxRequest && request.query.page) {
    return loadMoreDataForPagination_.call(response, templatePath + '/events-list', events, canLoadMore);
  }

  /** If we have ?popup=1 parameter, send JSON answer */
  if (request.query.popup) {
    return loadDataForPopup_.call(response, templatePath + '/page', currentProject, events, canLoadMore);
  } else {
    return loadPageData_.call(response, templatePath + '/page', currentProject, events, canLoadMore, eventsCount);
  }
};

/**
 * @this Request
 *
 * @param {String} templatePath - path to template
 * @param project
 * @param {Object} eventList
 * @param canLoadMore
 * @param {number} eventsCount
 * @return {String} - HTML content
 */
let loadPageData_ = function (templatePath, project, eventList, canLoadMore, eventsCount) {
  let response = this;

  return response.render(templatePath, {
    project : project,
    event  : eventList.shift(),
    events : eventList,
    canLoadMore: canLoadMore,
    eventsCount: eventsCount,
    eventsLimit: archiver.eventsLimit
  });
};

/**
 * @this Response
 *
 * @param {String} templatePath - path to template
 * @param project
 * @param {Object} eventList
 * @param canLoadMore
 * @return {String} - JSON formatted response
 */
let loadDataForPopup_ = function (templatePath, project, eventList, canLoadMore) {
  let response = this,
    currentEvent = eventList.shift();

  app.render(templatePath, {
    hideHeader : true,
    project     : project,
    event      : currentEvent,
    events     : eventList,
    canLoadMore: canLoadMore
  }, function (err, html) {
    let renderResponse = {};

    if (err) {
      logger.error('Can\'t render event traceback template because of ', err);
      renderResponse.error = 1;
    } else {
      renderResponse.event = currentEvent;
      renderResponse.traceback = html;
    }

    return response.json(renderResponse);
  });
};

/**
 * @param {String} templatePath - path to template
 * @param events
 * @param {Boolean} canLoadMore
 * @return {String} - JSON formatted response
 */
let loadMoreDataForPagination_ = function (templatePath, events, canLoadMore) {
  let response = this,
    currentEvent = events.shift();

  app.render(templatePath, {
    events
  }, function (err, html) {
    if (err) {
      logger.error(`Something wrong happened. Can't load more ${currentEvent.type} events because of `, err);
      response.sendStatus(500);
    }

    return response.json({traceback: html, canLoadMore: canLoadMore});
  });
};

/**
 * Show event page (route /garage/<project>/event/<hash>)
 *
 * @param req
 * @param res
 */
let event = (req, res, next) => {
  try {
    /**
     * Current user's project list stored in res.locals.userProjects
     * @see  app.js
     * @type {Array}
     */
    let userProjects = res.locals.userProjects,
      projectUri = req.params.project,
      eventGroupHash = req.params.id;

    /** pagination settings */
    let page = req.query.page || 1,
      limit = EVENT_LIMIT,
      skip = (parseInt(page) - 1) * (limit + 1);

    let currentProject = getProjectInfo(userProjects, projectUri);

    /**
     * If project was not found in the list of user's projects then return 404
     */
    if (!currentProject) {
      res.sendStatus(404);
      return;
    }

    modelEvents.get(currentProject.id, {groupHash: eventGroupHash}, false, false, limit + 1, skip)
      .then(markEventsAsRead.bind(null, currentProject))
      .then(async events => {
        let canLoadMore = events.length > limit;

        /**
         * Get count of total events with this groupHash
         */
        let eventsCount = await modelEvents.getCount(currentProject.id, {groupHash: eventGroupHash});

        return makeResponse_.call({req, res}, currentProject, events, canLoadMore, eventsCount);
      })
      .catch((err) => {
        logger.error('Error while handling event-page request: ', err);
        res.sendStatus(404);
      });
  } catch (e) {
    next(e)
  }
};

router.get('/:project/event/:id?', event);

module.exports = router;
