'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('yard/index');

});

router.get('/docs', function (req, res, next) {

  res.render('yard/docs/index');

});

module.exports = router;
