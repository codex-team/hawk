'use strict';

let express = require('express');
let router = express.Router();
let auth = require('../../../modules/auth');
let user = require('../../../models/user');
let Twig = require('twig');
let email = require('../../../modules/email');


let join = {

  /* Show join form */
  get: function (req, res, next) {
    if (res.locals.user) {
      res.redirect('/garage');
      return;
    }

    res.render('yard/auth/join');
  },

  /* Create new user */
  post: function (req, res, next) {
    if (res.locals.user) {
      res.redirect('/garage');
      return;
    }

    let newUserEmail = req.body.email;

    user.checkParamUniqueness({email: newUserEmail})
      .then(function (isEmailExist) {
        return user.add(newUserEmail)
          .then(function ({insertedUser, password}) {
            if (insertedUser) {
              if (process.env.ENVIRONMENT == 'DEVELOPMENT') {
                console.log('Your email: ', insertedUser.email);
                console.log('Your password: ', password);
              } else {
                let renderParams = {
                  password: password,
                  settingsLink : process.env.SERVER_URL + '/garage/settings'
                };

                Twig.renderFile('views/notifies/email/join.twig', renderParams, function (err, html) {
                  if (err) {
                    logger.error('Can not render notify template because of ', err);
                    return;
                  }

                  email.send(
                    insertedUser.email,
                    'Welcome to Hawk.so',
                    '',
                    html
                  );
                });
              }

              res.redirect('/login?success=1&email=' + insertedUser.email);
              return;
            } else {
              res.render('error', { message: 'Try again later.' });
            }
          }).catch(function (e) {
            logger.log('error', 'Can\'t add user because of ', e);
          });
      }).catch(function () {
        res.render('yard/auth/join', {
          message: {
            type: 'error',
            text: 'This email already registered. Please, <a href="/login">login</a>.'
          }
        });
        return;
      });
  }

};

router.get('/join', join.get);
router.post('/join', join.post);

module.exports = router;
