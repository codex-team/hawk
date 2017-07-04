'use strict';

let express = require('express');
let router = express.Router();
let user = require('../../models/user');
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
     * @type {Array}
     */
    let userDomains = res.locals.userDomains;

    getDomainInfo(userDomains, params.domainName)
      .then(function (currentDomain) {

        events.get(currentDomain.name, {groupHash: params.eventId}, false)
          .then(function (events) {

            res.render('garage/events/page', {
              currentDomain,
              event: events[0],
              events: events
            });

          });

      })
      .catch(function () {

        res.sendStatus(404);

      });

  });

};

router.get('/:domain/event/:id?', event);

module.exports = router;
