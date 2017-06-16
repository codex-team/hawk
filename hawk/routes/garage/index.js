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
      currentTag;

  user.getInfo(req, res)
    .then(function (userData_) {

      let params = req.params,
          allowedTags = ['fatal', 'warnings', 'notice', 'javascript'];

      currentDomain = params.domain;
      currentTag = params.tag;
      userData = userData_;

      /** Check if use tag w\o domain */
      if (!currentTag && allowedTags.includes(currentDomain)) {
        currentTag = currentDomain;
        currentDomain = null;
      }

      if (currentDomain && !userData.user.domains.includes(currentDomain)) {
        res.sendStatus(404);
        return;
      }

      if (currentTag && !allowedTags.includes(currentTag)) {
        res.sendStatus(404);
        return;
      }

      userData.domains.forEach(function (domain) {

        if (domain.name == currentDomain) {
          currentDomain = domain;
        }

      });

      let findParams = {};

      if (currentTag) {
        findParams.tag = currentTag;
      }

      if (currentDomain) {

        return events.get(currentDomain.name, findParams, true);

      } else {

        return events.getAll(userData.user, findParams);

      }

    })
    .then(function (events) {

      console.log(events);

      res.render('garage/index', {
        user: userData.user,
        domains: userData.domains,
        currentDomain: currentDomain,
        currentTag: currentTag,
        events: events
      });

    })
    .catch (function (e) {
      console.log('Error while getting user data for main garage page: %o', e);
    });

};

router.get('/:domain?/:tag?', index);

module.exports = router;
