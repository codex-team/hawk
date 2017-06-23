'use strict';

let express = require('express');
let router = express.Router();
let auth = require('../../../modules/auth');
let user = require('../../../models/user');


let join = {

  /* Show join form */
  get: function (req, res, next) {

    user.current(req).then(function (found) {

      if (found) {

        res.redirect('/garage');
        return;

      }

      res.render('yard/auth/join');

    });

  },

  /* Create new user */
  post: function (req, res, next) {

    user.current(req).then(function (found) {

      if (found) {

        res.redirect('/garage');
        return;

      }

      let email = req.body.email;

      user.checkParamUniqness({email: email})
        .then(function (isEmailExist) {

          return user.add(email)
            .then(function (insertedUser) {

              if (insertedUser) {

                res.redirect('/login?success=1');
                return;

              } else {

                res.render('error', { message: 'Try again later.' });

              }

            }).catch(console.log);

        }).catch(function () {

          res.render('yard/auth/join', {
            message: {
              type: 'error',
              text: 'This email already registred. Please, <a href="/login">login</a>.'
            }
          });
          return;

        });

    });

  }

};

router.get('/', join.get);
router.post('/', join.post);

module.exports = router;
