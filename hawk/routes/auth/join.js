var express = require('express');
var router = express.Router();
var mongo = require("../../modules/database");
var auth = require("../../modules/auth");
var email = require("../../modules/email");
var user = require('../../models/user');


var join = {

  /* Show join form */
  get: function (req, res, next) {

    user.current(req).then(function (found) {

      if (found) {
        res.redirect('/garage');
        return;
      }

      res.render('yard/auth/join');

    })

  },

  /* Create new user */
  post: function (req, res, next) {

    user.current(req).then(function (found) {
      if (found) {
        res.redirect('/garage');
        return;
      }


      var email = req.body.email;

      user.add(email).then(function (insertedUser) {
          if (insertedUser) {
            auth.authUser(res, insertedUser);
            res.redirect('/garage');
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
