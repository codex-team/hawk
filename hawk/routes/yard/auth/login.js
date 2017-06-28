'use strict';

let express = require('express');
let router = express.Router();
let auth = require('../../../modules/auth');
let user = require('../../../models/user');

let login = {

  /* Show log in form */
  get: function (req, res, next) {

    user.current(req).then(function (found) {

      if (found) {

        res.redirect('/garage');
        return;

      };

      let message = {};

      if (req.query.success) {

        message = {
          type: 'notify',
          text: 'We have send a password for account to your mailbox. Check it out.'
        };

      }

      res.render('yard/auth/login', { message: message });

    });

  },

  /* Log in function */
  post: function (req, res, next) {

    user.current(req).then(function (found) {

      if (found) {
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
        .then(function(result){
          if (result) {
            auth.authUser(res, result);
            res.redirect('/garage');
          } else {
            res.render('error', { message: 'Try again later.' });
          }
      }).catch(function (e) {

        logger.log('error', 'Can\'t find user because of ', e);

      });

    });

  }

};

router.get('/', login.get);
router.post('/', login.post);

module.exports = router;
