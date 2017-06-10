var express = require('express');
var router = express.Router();
var mongo = require("../../database");


var signin = {

  get: function (req, res, next) {

    res.render('auth/signIn', { title: 'Sign in' });

  },

  post: function (req, res, next) {

    var username = req.body.username,
        password = req.body.password;

    mongo.findOne('users', req.body)
      .then(function(result){
        if (result) {
          res.render('user', { user: req.body.username });
        } else {
          res.render('index', { title: 'Wrong user' });
        }
    });

  }

};

module.exports = {
  get: router.get('/', signin.get),
  post: router.post('/', signin.post)
};
