'use strict';

const express = require('express');
const router = express.Router();
const Archiver = require('../../modules/archiver');

router.get('/clear', async (req, res, next) => {
  let archiver = new Archiver(),
      events = await archiver.archive();

  res.send(JSON.stringify(events));
});

/**
 * Home page
 */
router.get('/', function (req, res, next) {
  res.render('yard/index', {
    user : res.locals.user
  });
});


/**
 * Docs page
 */
router.get('/docs', function (req, res, next) {
  res.render('yard/docs/index', {

    meta : {

      title : 'Platform documentation',
      description : 'Guide for integration and usage.'

    }

  });
});

module.exports = router;
