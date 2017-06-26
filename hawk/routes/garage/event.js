'use strict';

let express = require('express');
let router = express.Router();
let user = require('../../models/user');
let events = require('../../models/events');


/**
 * Returns all other events in group
 * @param  {Array} eventInfo
 * { _id: 'cac375abe6c1cc9613246eff37cd6722',
 * @param {string} eventInfo[].type:          - 'client',
 * @param {string} eventInfo[].tag:           - 'javascript',
 * @param {object} eventInfo[].errorLocation: - {file:  'hawk.js', line:  0, col: 0, full: 'hawk.js -> 0:0' },
 * @param {string} eventInfo[].message:       - 'Hawk client catcher test',
 * @param {Number} eventInfo[].time:          - 1498238847,
 * @param {Number} eventInfo[].count:         - 1
 * @return {Object} eventInfo with 'events' list
 */
function getAllEventsInGroup(eventInfo) {

  let event = eventInfo.pop(),
      groupId = event._id,
      eventsList;

  eventsList = events.get(currentDomain.name, {groupHash: eventId}, true);
  console.log("eventInfo: %o", eventInfo);
  console.log("eventsList: %o", eventsList);

  // let otherEvents = events.getAll
  //
  return eventInfo;

}

/**
 * Check if user can manage passed domain
 * @param  {string} domainName
 * @return {Promise}
 */
function getDomainInfo(req, domainName) {
  return new Promise(function(resolve, reject) {
    return user.getInfo(req)
            .then(function(userData) {

              /** Get domain info by user domain */
              userData.domains.forEach( domain => {
                if (domain.name === domainName) {
                  resolve(domain);
                }
              });

              /** If passed domain name was not found in user domains list */
              reject();

            })
            .catch(function(error) {
              reject(error);
            });
  });
}

/**
 * Event page (route /garage/<domain>/event/<hash>)
 *
 * @param req
 * @param res
 */
let event = function (req, res) {

  'use strict';

  // let userData,
  //   currentDomain,
  //   eventId;
  //

  let domainName = req.params.domain,
      eventId = req.paras.id;

  Promise.resolve(req, domainName, eventId).then(function(req, domainName, eventId) {

    getDomainInfo(req, domainName)
      .then(function(domain) {
        return events.get(domain.name, {groupHash: eventId}, true);
      })
      .then(function(events) {
        console.log("events -----: %o", events);
      })
      .catch(function() {
        res.sendStatus(404);
      });
  });

  /**
  user.getInfo(req, res)
    .then(function (userData_) {

      let params = req.params;

      currentDomain = params.domain;
      eventId = params.id;
      userData = userData_;

      if (currentDomain && !userData.user.domains.includes(currentDomain)) {

        res.sendStatus(404);
        return;

      }

      return

    })
    .then(getAllEventsInGroup)
    .then(function (event) {

      if (!event[0]) {

        res.sendStatus(404);
        return;

      }

      res.render('garage/events/page', {
        user: userData.user,
        domains: userData.domains,
        currentDomain: currentDomain,
        event: event[0]
      });

    })
    .catch (function (e) {

      console.log('Error while getting user data for event page: %o', e);

    });
  */

};

router.get('/:domain/event/:id?', event);

module.exports = router;
