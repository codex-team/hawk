var express = require('express');
var router = express.Router();
var mongo = require("../../modules/database");


var signup = {

  get: function (req, res, next) {

    res.render('auth/signUp', { title: 'Sign up' });

  },

  post: function (req, res, next) {

    var username = req.body.username,
        password = req.body.password + '_test';

    mongo.insertOne('sessions', req.body)
      .then(function(result){
        if (result) {
          res.render('user', { user: username });
        } else {
          res.render('index', { title: 'WRONG user' });
        }
    });

  }

};

module.exports = {
  get: router.get('/', signup.get),
  post: router.post('/', signup.post)
};
