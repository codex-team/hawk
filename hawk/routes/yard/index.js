'use strict';

var express = require('express');
var router = express.Router();

/**
 * Home page
 */
router.get('/', function (req, res, next) {

  res.render('yard/index');

});


/**
 * Docs page
 */
router.get('/docs', function (req, res, next) {

  res.render('yard/docs/index', {

    meta : {

      title : 'Platform documentation',
      description : 'Complete documentation on how to start using Hawk on your project.'

    }

  });

});

module.exports = router;
