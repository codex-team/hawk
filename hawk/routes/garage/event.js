'use strict';

let express = require('express');
let router = express.Router();
let events = require('../../models/events');

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
     * @type {Object} userDomains
     */
    let userDomains = res.locals.userDomains;
    let isAjaxRequest = req.xhr;

    /**
     * pagination settings
     */
    let page    = req.query.page || 1,
        limit   = 10,
        skip    = (parseInt(page) - 1) * limit;

    getDomainInfo(userDomains, params.domainName)
      .then(function (currentDomain) {

        events.get(currentDomain.name, {groupHash: params.eventId}, false, false, limit, skip)
          .then(function (events) {

            let currentEvent = events.shift();

            if (isAjaxRequest && req.query.page) {

              app.render('garage/events/' + currentEvent.type + '/events-list', {
                  /** ES6 objects */
                  currentDomain,
                  events

              }, function(error, response) {

                  if (error) {
                    logger.error(`Something bad wrong. I can't load more ${currentEvent.type} events from ${currentDomain} because of `, error);
                  }

                  res.json(response);
                  res.sendStatus(200);

              });

            }

            /** If we have ?popup=1 parameter, send JSON answer */
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
                res.sendStatus(200);

              });

            } else {

              res.render('garage/events/' + currentEvent.type + '/page', {
                currentDomain,
                event: currentEvent,
                events: events
              });

              res.sendStatus(200);

            }

          })
          .catch(function(err) {
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
