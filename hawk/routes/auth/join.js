var express = require('express');
var router = express.Router();
var mongo = require("../../modules/database");
var auth = require("../../modules/auth");
var email = require("../../modules/email");
var user = require('../../models/user');


var join = {

  /* Show join form */
  get: function (req, res, next) {

    user.get(req).then(function (found) {

      if (found) {
        res.redirect('/garage');
        return;
      }

      res.render('yard/auth/join');

    })

  },

  /* Create new user */
  post: function (req, res, next) {

    user.get(req).then(function (found) {
      if (found) {
        res.redirect('/garage');
        return;
      }
    })

    var email = req.body.email,
        password = auth.generatePassword();

    console.log(password);

    let newUser = {
      'email': email,
      'password': auth.generateHash(password)
    };

    mongo.insertOne('users', newUser)
      .then(function(result){
        newUser = result.ops[0];
        if (user) {
          auth.authUser(res, newUser);
          res.redirect('/garage');
        } else {
          res.render('error', { message: 'Try again later.' });
        }
    }).catch(console.log);

  }

};

router.get('/', join.get);
router.post('/', join.post);

module.exports = router;
