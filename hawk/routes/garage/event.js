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
 * Global requste handler
 * Calls in current Request and Response context via necessary data
 * Delegates required to separate functions that has their own response
 *
 * @typedef {Object} GarageResponseContext
 * @type {Object} req - Request
 * @type {Object} res - Response
 *
 * @this {Object} GarageResponseContext
 *
 * @param {String} domain - requsted domain
 * @param {Array}  events - obtained from Database events
 */
let handleResponse_ = function(domain, events) {

    /**
     * work with current request context
     * context:
     *  - Request
     *  - Response
     */
    let context = this;

    let request       = context.req,
        response      = context.res,
        isAjaxRequest = request.xhr,
        currentEvent  = events.shift(),
        templatePath  = 'garage/events/' + currentEvent.type;

    /** requiring page via AJAX */
    if (isAjaxRequest && request.query.page) {
        loadMoreDataForPagination_.call(response, templatePath + '/events-list', domain, events);
    }

    /** If we have ?popup=1 parameter, send JSON answer */
    if (request.query.popup) {
        loadDataForPopup_.call(response, templatePath + '/page', domain, events);
    }

    loadPageData_.call(response, templatePath + '/page', domain, events);
};

/**
 * @this Request
 *
 * @param {String} templatePath - path to template
 * @param {Object} domain
 * @param {Object} event
 * @return {String} - HTML content
 */
let loadPageData_ = function(templatePath, domain, events) {

  let response = this;

  response.render(templatePath, {
    domain : domain,
    event  : events.shift(),
    events : events
  });

  response.status(200);

}

/**
 * @this Response
 *
 * @param {String} templatePath - path to template
 * @param {Object} domain
 * @param {Object} event
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

      response.json(renderResponse);
      response.status(200);

    });
}

/**
 * @param {String} templatePath - path to template
 * @param {Object} domain
 * @param {Object} event
 * @return {String} - JSON formatted response
 */
let loadMoreDataForPagination_ = function(templatePath, domain, events) {

  let response = this,
      currentEvent = events.shift();

  app.render(templatePath, {
    domain,
    events
  }, function(err, res) {

      if (error) {
        logger.error(`Something bad wrong. I can't load more ${currentEvent.type} events from ${domain} because of `, error);
      }

      response.json(res);
      response.status(200);

  });
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
        limit   = 10,
        skip    = (parseInt(page) - 1) * limit;

    getDomainInfo(userDomains, params.domainName)
      .then(function (currentDomain) {

        events.get(currentDomain.name, {groupHash: params.eventId}, false, false, limit, skip)
          .then(handleResponse_.bind({ req, res }, currentDomain))
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
