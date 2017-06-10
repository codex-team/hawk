var express = require('express');
var router = express.Router();
var mongo = require("../../modules/database");
var auth = require("../../modules/auth");


var join = {

  /* Show join form */
  get: function (req, res, next) {

    if (userId) {
      res.redirect('/garage');
      return;
    }

    res.render('yard/auth/join');

  },

  /* Create new user */
  post: function (req, res, next) {

    if (userId) {
      res.redirect('/garage');
      return;
    }

    var email = req.body.email,
        password = auth.generatePassword();

    console.log(password);

    let user = {
      'email': email,
      'password': auth.generateHash(password)
    };

    mongo.insertOne('users', user)
      .then(function(result){
        user = result.ops[0];
        if (user) {
          auth.authUser(res, user);
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
