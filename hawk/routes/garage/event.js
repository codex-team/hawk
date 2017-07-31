'use strict';

let express = require('express');
let router = express.Router();
let events = require('../../models/events');
let twig  = require('twig');
let modelEvents = require('../../models/events');
let mongo = require('../../modules/database');

/**
 * limit events per page
 */
const EVENT_LIMIT = 5;


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
let markEventsAsRead = function (currentDomain, events) {
  let eventsIds = events.map(event => new mongo.ObjectId(event['_id']));

  modelEvents.markRead(currentDomain.name, eventsIds).then(function (docs, err) {

  }).catch(function (err) {
    console.log(err);
  });

  return events;
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
 * @param {String} domain - requsted domain
 * @param {Object} data
 * @param {Array} data.eventList - obtained from Database events
 * @param {Boolean} data.canLoadMore - is next page exist ?
 */
let makeResponse_ = function(domain, data) {

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
        events = data.eventList,
        canLoadMore = data.canLoadMore,
        currentEvent = events.shift(),
        templatePath = 'garage/events/' + currentEvent.type;

    /** requiring page via AJAX */
    if (isAjaxRequest && request.query.page) {
        return loadMoreDataForPagination_.call(response, templatePath + '/events-list', domain, events, canLoadMore);
    }

    /** If we have ?popup=1 parameter, send JSON answer */
    if (request.query.popup) {
        return loadDataForPopup_.call(response, templatePath + '/page', domain, events);
    } else {
        return loadPageData_.call(response, templatePath + '/page', domain, events);
    }
};

/**
 * @this Request
 *
 * @param {String} templatePath - path to template
 * @param {Object} domain
 * @param {Object} events
 * @return {String} - HTML content
 */
let loadPageData_ = function(templatePath, domain, events) {

  let response = this;

  return response.render(templatePath, {
    domain : domain,
    event  : events.shift(),
    events : events
  });

};

/**
 * @this Response
 *
 * @param {String} templatePath - path to template
 * @param {Object} domain
 * @param {Object} events
 * @return {String} - JSON formatted response
 */
let loadDataForPopup_ = function(templatePath, domain, events) {

  let response = this,
      currentEvent = events.shift();

  app.render(templatePath, {
    hideHeader : true,
    domain     : domain,
    event      : currentEvent,
    events     : events
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
 * @param {Object} domain
 * @param {Object} events
 * @param {Boolean} canLoadMore
 * @return {String} - JSON formatted response
 */
let loadMoreDataForPagination_ = function(templatePath, domain, events, canLoadMore) {

  let response = this,
      currentEvent = events.shift();

  if (canLoadMore) {

    app.render(templatePath, {
      domain,
      events
    }, function(err, res) {

        if (err) {
            logger.error(`Something bad wrong. I can't load more ${currentEvent.type} events from ${domain} because of `, err);
        }

        return response.json({traceback: res, canLoadMore: true});
    });

  } else {

      return response.json ({ traceback : '', canLoadMore : false });

  }

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
    })
    .then(function (params) {

        /**
         * Current user's domains list stored in res.locals.userDomains
         * @see  app.js
         * @type {Object} userDomains
         */
        let userDomains = res.locals.userDomains;

        /** pagination settings */
        let page    = req.query.page || 1,
            limit   = EVENT_LIMIT,
            skip    = (parseInt(page) - 1) * limit;

        getDomainInfo(userDomains, params.domainName)
            .then((currentDomain) => {

                modelEvents.get(currentDomain.name, {groupHash: params.eventId}, false, false, limit + 1, skip)
                    .then((events) => markEventsAsRead(currentDomain, events))
                    .then((eventList) => {
                        let canLoadMore = eventList.length > limit;
                        return {
                            eventList,
                            canLoadMore
                        };
                    })
                    .then(makeResponse_.bind({ req, res }, currentDomain))
                    .catch(function (err) {
                        logger.error('Error while handling event-page request: ', err);
                        res.sendStatus(404);
                    });
            })
            .catch(function () {

                res.sendStatus(404);

            });
    });
};

router.get('/:domain/event/:id?', event);

module.exports = router;
