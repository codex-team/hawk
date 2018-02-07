'use strict';

let express = require('express');
let router = express.Router();
let user = require('../../../models/user');

/**
 * /recover rout handlers
 *
 * @type {{get: recover.get, post: recover.post}}
 */
let recover = {

  get: function (req, res) {
    global.logger.debug('Recover page received post data');
    let recoverHash = req.params.hash,
        action = '/recover/' + recoverHash;

    user.getByParams({recoverHash: recoverHash})
      .then(function (foundUser) {
        if (!foundUser) {
          res.render('yard/errors/error', {
            title: 'This recover link doesn\'t works.',
            message: 'Try reset your password again.'
          });
          return;
        }
        res.render('yard/auth/recover', {action: action});
      });
  },

  /**
   * Get new password from user's input and save it if password and repeated password equal
   *
   * @param req
   * @param res
   */
  post: function (req, res) {
    global.logger.debug('Recover page received post data');
    let recoverHash = req.params.hash,
        action = '/recover/' + recoverHash,
        password = req.body.password,
        repeatPassword = req.body.repeatPassword;


    user.getByParams({recoverHash: recoverHash})
      .then(function (foundUser) {
        if (!foundUser) {
          res.render('yard/errors/error', {
            title: 'This recover link doesn\'t works.',
            message: 'Try reset your password again.'
          });
          return;
        }

        if (password != repeatPassword) {
          res.render('yard/auth/recover', {action: action, message: {type: 'error', text: 'Passwords don\'t match'}});
          return;
        }

        return user.update(foundUser, {password: password, recoverHash: null})
          .then(function () {
            return foundUser.email;
          });
      })
      .then(function (email) {
        res.redirect('/login?email=' + email);
      });
  }
};

router.get('/recover/:hash', recover.get);
router.post('/recover/:hash', recover.post);

module.exports = router;