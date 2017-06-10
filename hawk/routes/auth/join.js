var express = require('express');
var router = express.Router();
var mongo = require("../../modules/database");
var auth = require("../../modules/auth");


var join = {

  /* Show join form */
  get: function (req, res, next) {

    if (userId) {
      res.redirect('/');
      return;
    }

    res.render('auth/join');

  },

  /* Create new user */
  post: function (req, res, next) {

    if (userId) {
      res.redirect('/');
      return;
    }

    var email = req.body.username,
        password = auth.generatePassword();

    console.log(password);

    user = {
      'email': email,
      'password': auth.generateHash(password)
    }

    mongo.insertOne('users', user)
      .then(function(result){
        user = result.ops[0];
        if (user) {
          auth.authUser(res, user);
          res.render('user', { user: user.email });
        } else {
          res.render('error', { message: 'Try again later.' });
        }
    }).catch(console.log);

  }

};

router.get('/', join.get);
router.post('/', join.post);

module.exports = router;
