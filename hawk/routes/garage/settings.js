let express = require('express');
let router = express.Router();
let user = require('../../models/user');
let websites = require('../../models/websites');

let csrf = require('../../modules/csrf');

/**
 * Garage settings page
 *
 * @param req
 * @param res
 */
let index = function (req, res) {

  user.getInfo(req, res)
    .then(function (userData) {

      res.render('garage/settings', {
        user: userData.user,
        domains: userData.domains,
        csrfToken: req.csrfToken(),
        meta : {
          title : 'User settings'
        }
      });

    })
    .catch (function (e) {

      logger.log('error', 'Error while getting user data for settings page: %o', e);

    });

};

/**
 * Settings update handler
 *
 * @param req
 * @param res
 */
let update = function (req, res) {

  let post = req.body;

  user.current(req)
    .then(function (currentUser) {

      let params = {
        email: post.email,
        notifies: {
          email: false,
          tg: false,
          slack: false
        },
      };

      if (post['email-notify']) params.notifies.email = true;
      if (post['tg-notify']) params.notifies.tg = true;
      if (post['slack-notify']) params.notifies.slack = true;

      if (post.password) params.password = post.password;
      if (post['tg-webhook']) params.tgHook = post['tg-webhook'];
      if (post['slack-webhook']) params.slackHook = post['slack-webhook'];

      if (!params.email) {

        throw Error('Email should be passed');

      }

      return user.update(currentUser, params);

    })
    .then(function () {

      res.redirect('/garage/settings?success=1');

    })
    .catch(function (e) {

      res.redirect('/garage/settings?success=0&message='+e.message);

    });

};

/**
 * Unlink domain action
 * Remove domain data from database and unlink it from user's domains list
 *
 * @param req
 * @param res
 */
let unlinkDomain = function (req, res) {

  user.current(req)
    .then(function (currentUser) {

      let token = req.query.token;

      websites.remove(currentUser, token)
        .then(function () {

          res.sendStatus(200);

        })
        .catch(function () {

          res.sendStatus(500);

        });

    });

};

router.get('/settings', csrf, index);
router.post('/settings/save', csrf, update);
router.get('/settings/unlink', csrf, unlinkDomain);

module.exports = router;
