'use strict';

var express = require('express');
var router = express.Router();

/**
 * Home page
 */
router.get('/', function (req, res, next) {
  global.logger.debug('Index page visited');
  res.render('yard/index', {
    user : res.locals.user
  });
});


/**
 * Docs page
 */
router.get('/docs', function (req, res, next) {
  global.logger.debug('Docs page visited');
  res.render('yard/docs/index', {

    meta : {

      title : 'Platform documentation',
      description : 'Guide for integration and usage.'

    }

  });
});

module.exports = router;
