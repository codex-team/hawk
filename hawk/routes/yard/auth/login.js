'use strict';

let express = require('express');
let router = express.Router();
let auth = require('../../../modules/auth');
let user = require('../../../models/user');

let login = {

  /* Show log in form */
  get: function (req, res, next) {
    try {
      if (res.locals.user) {
        res.redirect('/garage');
        return;
      }

      let params = {
        message: null,
        email: ''
      };

      if (req.query.success) {
        params.message = {
          type: 'notify',
          text: 'We have send a password for account to your mailbox. Check it out.'
        };
      }

      if (req.query.email) {
        params.email = req.query.email;
      }

      res.render('yard/auth/login', params);
    } catch (e) {
      next(e)
    }
  },

  /* Log in function */
  post: function (req, res, next) {
    try {
      if (res.locals.user) {
        res.redirect('/garage');
        return;
      }

      let email = req.body.email,
        password = req.body.password;

      let newUser = {
        'email': email,
        'password': auth.generateHash(password)
      };

      user.getByParams(newUser)
        .then(function (result) {
          if (result) {
            auth.authUser(res, result);

            let redirectUri = req.cookies.redirect;

            if (redirectUri) {
              res.clearCookie('redirect');
              res.redirect(redirectUri);
              return;
            }

            res.redirect('/garage');
          } else {
            let params = {
              message: {
                type: 'error',
                text: 'Wrong email or password.'
              },
              email: req.body.email
            };

            res.render('yard/auth/login', params);
          }
        }).catch(function (e) {
          logger.log('error', 'Can\'t find user because of ', e);
          global.catchException(e);
        });
    } catch (e) {
      next(e)
    }
  }

};

router.get('/login', login.get);
router.post('/login', login.post);

module.exports = router;
