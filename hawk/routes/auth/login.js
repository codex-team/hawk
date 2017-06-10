var express = require('express');
var router = express.Router();
var mongo = require("../../modules/database");
var auth = require('../../modules/auth');


var login = {

  get: function (req, res, next) {

    if (userId) {
      res.redirect('/');
      return;
    }

    res.render('auth/login');

  },

  post: function (req, res, next) {

    if (userId) {
      res.redirect('/');
      return;
    }

    var email = req.body.email,
        password = req.body.password;

    user = {
      'email': email,
      'password': auth.generateHash(password)
    }

    mongo.findOne('users', user)
      .then(function(result){
        if (result) {
          auth.authUser(res, result);
          res.render('user', { user: user.email });
        } else {
          res.render('error', { message: 'Try again later.' });
        }
    }).catch(console.log);

  }

};

module.exports = {
  get: router.get('/', login.get),
  post: router.post('/', login.post)
};
