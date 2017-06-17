let express = require('express');
let router = express.Router();
let user = require('../../models/user');
let events = require('../../models/events');

/**
 * Garage events lists (route /garage/<domain>/<tag>)
 *
 * @param req
 * @param res
 */
let index = function (req, res) {

  'use strict';

  let userData,
    currentDomain,
    eventId;

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

      userData.domains.forEach(function (domain) {

        if (domain.name == currentDomain) {

          currentDomain = domain;

        }

      });

      return events.get(currentDomain.name, {groupHash: eventId}, true);

    })
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

      console.log('Error while getting user data for main garage page: %o', e);

    });

};

router.get('/:domain/event/:id?', index);

module.exports = router;
