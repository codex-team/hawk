'use strict';

let express = require('express');
let router = express.Router();
let events = require('../../models/events');

/**
 * Garage events lists (route /garage/<domain>/<tag>)
 *
 * @param req
 * @param res
 */
let index = function (req, res) {

  let currentDomain,
    currentTag;

  let params = req.params,
    allowedTags = ['fatal', 'warnings', 'notice', 'javascript'];

  currentDomain = params.domain;
  currentTag = params.tag;

  /** Check if use tag w\o domain */
  if (!currentTag && allowedTags.includes(currentDomain)) {

    currentTag = currentDomain;
    currentDomain = null;

  }

  if (currentTag && !allowedTags.includes(currentTag)) {

    res.sendStatus(404);
    return;

  }

  if (currentDomain) {

    res.locals.userDomains.forEach(function (domain) {

      if (domain.name == currentDomain) {

        currentDomain = domain;

      }

    });

    if (!currentDomain.name) {

      res.sendStatus(404);
      return;

    }

  };

  let findParams = {};

  if (currentTag) {

    findParams.tag = currentTag;

  }

  Promise.resolve().then(function () {

    if (currentDomain) {

      return events.get(currentDomain.name, findParams, true);

    } else {

      return events.getAll(res.locals.user, findParams);

    }

  })
    .then(function (events) {

      res.render('garage/index', {
        user: res.locals.user,
        userDomains: res.locals.userDomains,
        currentDomain: currentDomain,
        currentTag: currentTag,
        events: events,
        meta : {
          title : 'Garage'
        }
      });

    })
    .catch (function (e) {

      logger.error('Error while getting user data for main garage page: ', e);

    });

};

router.get('/:domain?/:tag?', index);

module.exports = router;
