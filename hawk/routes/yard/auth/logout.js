'use strict';

var express = require('express');
var router = express.Router();
var auth = require('../../../modules/auth');


router.get('/logout', function (req, res) {
  try {
    auth.logout(res);
    res.redirect('/');
  } catch (e) {
    next(e)
  }
});

module.exports = router;
