let express = require('express');
let router = express.Router();
let user = require('../../models/user');

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

router.get('/settings', csrf, index);
router.post('/settings/save', csrf, update);

module.exports = router;
