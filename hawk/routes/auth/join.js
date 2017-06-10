var express = require('express');
var router = express.Router();
var mongo = require("../../modules/database");
var auth = require("../../modules/auth");


var join = {

  get: function (req, res, next) {

    if (userId) {
      res.redirect('/');
      return;
    }

    res.render('auth/join');

  },

  post: function (req, res, next) {

    if (userId) {
      res.redirect('/');
      return;
    }

    var email = req.body.username,
        password = Math.random().toString(36).slice(-8);

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

module.exports = {
  get: router.get('/', join.get),
  post: router.post('/', join.post)
};
