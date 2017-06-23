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

                auth.authUser(res, insertedUser);
                res.redirect('/garage');

              } else {

                res.render('error', { message: 'Try again later.' });

              }

            }).catch(console.log);

        }).catch(function () {

          res.render('error', { message: 'User with this email ia already registered. Enter the other email or try to remember password.' });
          return;

        });

    });

  }

};

router.get('/', join.get);
router.post('/', join.post);

module.exports = router;
