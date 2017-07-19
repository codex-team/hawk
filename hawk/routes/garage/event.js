'use strict';

let express = require('express');
let router = express.Router();
let modelEvents = require('../../models/events');
let mongo = require('../../modules/database');

/**
 * Check if user can manage passed domain
 * @param  {Array} userDomains  — current user's domains list
 * @param  {string} domainNme   — current user's domns list
 * @return {Promise}
 */
function getDomainInfo(userDomains, domainName) {
  return new Promise(function (resolve, reject) {
    /** Get domain info by user domain */
    userDomains.forEach( domain => {
      if (domain.name === domainName) {
        resolve(domain);
        return;
      }
    });

    /** If passed domain name was not found in user domains list */
    reject();
  });
}

/**
* Marks all events in list as read
* @param {Array} events - events list
*/
let markReadEvents = function (currentDomain, events) {
  let eventsIds = [];

  events.forEach(function (event) {
    eventsIds.push(new mongo.ObjectId(event['_id']));
  });

  modelEvents.markRead(currentDomain.name, eventsIds).then(function (docs, err) {
    console.log({
      modifiedCount: docs.modifiedCount,
      upsertedId: docs.upsertedId,
      upsertedCount: docs.upsertedCount,
      matchedCount: docs.matchedCount
    }, err);
  }).catch(function (err) {
    console.log(err);
  });

  return events;
};

/**
 * Event page (route /garage/<domain>/event/<hash>)
 *
 * @param req
 * @param res
 */
let event = function (req, res) {
  Promise.resolve({
    domainName: req.params.domain,
    eventId: req.params.id
  }).then(function (params) {
    /**
     * Current user's domains list stored in res.locals.userDomains
     * @see  app.js
     * @type {Array}
     */
    let userDomains = res.locals.userDomains;

    getDomainInfo(userDomains, params.domainName)
      .then(function (currentDomain) {
        modelEvents.get(currentDomain.name, {groupHash: params.eventId}, false)
          .then(function (events) {
            return markReadEvents(currentDomain, events);
          })
          .then(function (events) {
            let currentEvent = events.shift();

            /**
             * If we have ?popup=1 parameter, send JSON answer
             */
            if (req.query.popup) {
              app.render('garage/events/' + currentEvent.type + '/page', {
                hideHeader: true,
                currentDomain,
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
                currentDomain,
                event: currentEvent,
                events: events
              });
            }
          })
          .catch(function (err) {
            logger.error('Error while handling event-page request: ', err);
          });
      })
      .catch(function () {
        res.sendStatus(404);
      });
  });
};

router.get('/:domain/event/:id?', event);

module.exports = router;
