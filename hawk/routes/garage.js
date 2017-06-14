let express = require('express');
let router = express.Router();
let events = require('../models/events');
let websites = require('../models/websites');
let user = require('../models/user');

let getUser = function (req, res) {

  let currentUser = null,
      domains = null;

  return user.current(req)
      .then(function (currentUser_) {

        currentUser = currentUser_;

        if (!currentUser) {
            res.sendStatus(403);
            return;
        }

        return websites.getByUser(currentUser)

      })
      .then(function (domains_) {

        domains = domains_;

        let queries = [];
        domains.forEach(function (domain) {

            let query = events.countTags(domain.name)
                .then(function (tags) {
                    tags.forEach(function (tag) {
                        domain[tag._id] = tag.count;
                    });
                }).catch(function(e) {
                    console.log('Events Query composing error: %o', e);
                });

            queries.push(query);

        });

        return Promise.all(queries);

      })
      .then(function () {

        return {
          user: currentUser,
          domains: domains
        }

      })
      .catch(function (e) {
          console.log('Can\'t get user because of %o', e);
      })
};

let main = function (req, res) {

  'use strict';

  let userData,
      currentDomain,
      currentTag;

  getUser(req, res).then(function (userData_) {

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

      return events.get(currentDomain.name, findParams);

    } else {

      return events.getAll(userData.user, findParams);

    }

  })
  .then(function (events) {

    res.render('garage/index', {
      user: userData.user,
      domains: userData.domains,
      currentDomain: currentDomain,
      currentTag: currentTag,
      events: events
    });

  }).catch (function (e) {
      console.log('Error while getting user data for main garage page: %o', e);
  });

};

let settings = function (req, res) {

  let userData;

  getUser(req, res).then(function (userData_) {

    userData = userData_;



  })
      .then(function () {
          res.render('garage/settings', {
            user: userData.user,
            domains: userData.domains
          })
      })
      .catch (function (e) {
          console.log('Error while getting user data for settings page: %o', e);
      })

};

router.get('/settings', settings);
router.get('/:domain?/:tag?', main);

module.exports = router;