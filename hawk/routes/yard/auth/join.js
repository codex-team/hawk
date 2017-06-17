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

      user.add(email).then(function (insertedUser) {

        if (insertedUser) {

          res.redirect('/login?status=success');

        } else {

          res.render('error', { message: 'Try again later.' });

        }

      }).catch(console.log);

    });

  }

};

router.get('/', join.get);
router.post('/', join.post);

module.exports = router;
