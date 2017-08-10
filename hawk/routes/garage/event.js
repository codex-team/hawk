'use strict';

let express = require('express');
let router = express.Router();
let modelEvents = require('../../models/events');
let mongo = require('../../modules/database');
let collections = require('../../config/collections');

/**
 * Check if user can manage passed domain
 * @return {Promise}
 * @param userProjects
 * @param projectUri
 */
function getProjectInfo(userProjects, projectUri) {
  return new Promise(function (resolve, reject) {
    /** Get domain info by user domain */
    userProjects.forEach( project => {
      if (project.user.projectUri === projectUri) {
        resolve(project);
        return;
      }
    });

    /** If passed domain name was not found in user domains list */
    reject();
  });
}

/**
* Marks all events in list as read
* @param currentProject
* @param {Array} events - events list
*/
let markEventsAsRead = function (currentProject, events) {
  let eventsIds = events.map(event => new mongo.ObjectId(event['_id'])),
      collection = collections.EVENTS + ':' + currentProject.id;

  modelEvents.markRead(collection, eventsIds).then(function (docs, err) {

  }).catch(function (err) {
    console.log(err);
  });

  return events;
};

/**
 * Event page (route /garage/<project>/event/<hash>)
 *
 * @param req
 * @param res
 */
let event = function (req, res) {
  Promise.resolve({
    projectUri: req.params.project,
    eventId: req.params.id
  }).then(function (params) {
    /**
     * Current user's project list stored in res.locals.userProjects
     * @see  app.js
     * @type {Array}
     */
    let userProjects = res.locals.userProjects;

    getProjectInfo(userProjects, params.projectUri)
      .then(function (currentProject) {
        return modelEvents.get(currentProject.id, {groupHash: params.eventId}, false)
          .then(function (events) {
            markEventsAsRead(currentProject, events);
            return {currentProject, events};
          });
      })
      .then(function ({currentProject, events}) {
        let currentEvent = events.shift();

        /**
         * If we have ?popup=1 parameter, send JSON answer
         */

        if (req.query.popup) {
          app.render('garage/events/' + currentEvent.type + '/page', {
            hideHeader: true,
            currentProject,
            event: currentEvent,
            events: events
          }, function (err, html) {
            let response = {};

            if (err) {
              logger.error('Can not render event traceback template because of ', err);
              response.error = 1;
            } else {
              response.event = currentEvent;
              response.traceback = html;
            }

            res.json(response);
          });
        } else {
          res.render('garage/events/' + currentEvent.type + '/page', {
            currentProject: currentProject,
            event: currentEvent,
            events: events
          });
        }
      })
      .catch(function (err) {
        logger.error('Error while handling event-page request: ', err);
        res.sendStatus(404);
      });
  });
};

router.get('/:project/event/:id?', event);

module.exports = router;
