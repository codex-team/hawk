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

    main: {

      title : 'Hawk.so Docs',
      description : 'Hawk.so is a clever and easy-to-use error tracker. It helps improve your applications. To learn how to start using Hawk..'

    }

  });

});

module.exports = router;
