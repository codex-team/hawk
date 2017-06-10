var express = require('express');
var router = express.Router();
var auth = require('../../modules/auth');


router.get('/', function (req, res) {
  auth.logout(res);
  res.render('index', { title: 'See you' });
});

module.exports = router;
