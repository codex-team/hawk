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

    console.log(user.password);

    mongo.findOne('users', user)
      .then(function(result){
        if (result) {
            console.log(result.password);
            auth.authUser(res, user);
            res.render('user', { user: user.email });
        } else {
          res.render('error', { message: 'Try again later.' });
        }
    });

  }

};

module.exports = {
  get: router.get('/', login.get),
  post: router.post('/', login.post)
};
