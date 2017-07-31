'use strict';

let express = require('express');
let router = express.Router();
let user = require('../../../models/user');
let mailer = require('../../../modules/email');
let Twig = require('twig');

/**
 * /reset routes handler
 * @type {{get: reset.get, post: reset.post}}
 */
let reset = {
  get: function (req, res) {
    res.render('yard/auth/reset');
  },

  post: function (req, res) {
    let email = req.body.email;

    user.getByParams({email: email})
      .then(function (foundUser) {
        if (!foundUser) {
          let params = {
            message: {
              type: 'error',
              text: 'No user with this email'
            },
            email: email
          };

          res.render('yard/auth/reset', params);
          return;
        }

        return user.saveRecoverHash(foundUser._id);
      })
      .then(function (recoverHash) {
        Twig.renderFile('views/notifies/email/recover.twig', {
          recoverLink: process.env.SERVER_URL + '/recover/' + recoverHash
        }, function (err, template) {
          mailer.send(email, 'Password recover', '', template);

          res.render('yard/auth/reset', {
            message: {
              type: 'notify',
              text: 'We have send instructions to your mailbox. Check it out.'
            },
            email: email
          });
        });
      })
      .catch(function (e) {
        logger.log('Error while resetting user password ', e);
        res.render('yard/errors/error', {title: 500, message: 'Something went wrong'});
      });
  }
};

router.get('/reset', reset.get);
router.post('/reset', reset.post);

module.exports = router;
