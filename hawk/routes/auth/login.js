var express = require('express');
var router = express.Router();
var mongo = require("../../modules/database");
var auth = require('../../modules/auth');
var user = require('../../models/user');

var login = {

  /* Show log in form */
  get: function (req, res, next) {
    user.get(req).then(function (found) {
      if (found) {
        res.redirect('/garage');
        return;
      }

      res.render('yard/auth/login');
    })
  },

  /* Log in function */
  post: function (req, res, next) {

    user.get(req).then(function (found) {

      if (found) {
        res.redirect('/garage');
        return;
      }

    var email = req.body.email,
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
      }).catch(console.log);

    });

  }

};

router.get('/', login.get);
router.post('/', login.post);

module.exports = router;
