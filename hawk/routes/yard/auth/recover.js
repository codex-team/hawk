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
    let recoverHash = req.params.hash,
        action = '/recover/' + recoverHash;

    user.getByParams({recoverHash: recoverHash})
      .then(function (foundUser) {
        if (!foundUser) {
          res.render('yard/errors/error', {title: 'Your account not found'});
          return;
        }
        res.render('yard/auth/recover', {action: action});
      });

  },

  post: function (req, res) {
    let recoverHash = req.params.hash,
        action = '/recover/' + recoverHash,
        password = req.body.password,
        repeatPassword = req.body.repeatPassword;


    user.getByParams({recoverHash: recoverHash})
      .then(function (foundUser) {
        if (!foundUser) {
          res.render('yard/errors/error', {title: 'Your account not found'});
          return;
        }

        if (password != repeatPassword) {
          res.render('yard/auth/recover', {action: action, message: {type: 'error', text: 'Passwords don\'t match'}});
          return;
        }

        return user.update(foundUser, {password: password, recoverHash: null});
      })
      .then(function () {
        res.redirect('/login');
      });
  }
};

router.get('/:hash', recover.get);
router.post('/:hash', recover.post);

module.exports = router;