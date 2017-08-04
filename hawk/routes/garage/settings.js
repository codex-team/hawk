let express = require('express');
let router = express.Router();
let user = require('../../models/user');
let websites = require('../../models/websites');
let project = require('../../models/project');

let csrf = require('../../modules/csrf');

/**
 * Garage settings page
 *
 * @param req
 * @param res
 */
let index = function (req, res) {
  let params = {
    user: res.locals.user,
    domains: res.locals.userDomains,
    csrfToken: req.csrfToken(),
    meta : {
      title : 'User settings'
    },
    success: req.query.success,
    message: req.query.message,
    projects: res.locals.userProjects
  };

  res.render('garage/settings', params);
};

/**
 * Settings update handler
 *
 * @param req
 * @param res
 */
let update = function (req, res) {
  let post = req.body;

  try {
    let params = {
      email: post.email,
    };

    if (post.password) {
      if (post.password !== post.repeatedPassword) {
        throw Error('Passwords don\'t match');
      }
      params.password = post.password;
    }

    if (!params.email) {
      throw Error('Email should be passed');
    }

    user.update(res.locals.user, params)
      .then(function () {
        let message = 'Saved 😉';

        res.redirect('/garage/settings?success=1&message=' + message);
      });
  } catch (e) {
    res.redirect('/garage/settings?success=0&message='+e.message);
  }
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
