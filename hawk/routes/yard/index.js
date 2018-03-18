'use strict';

const express = require('express');
const router = express.Router();
const Archiver = require('../../modules/archiver');

/**
 * Route for the Archiver
 * Archiver removes staled events that exeeded Events Limit (10k)
 * Fired by Cron every 2 hours
 */
if (process.env.ARCHIVER_ROUTE) {
  router.get(`${process.env.ARCHIVER_ROUTE}`, async (req, res, next) => {
    let archiver = new Archiver(),
        archivedEventsCount = await archiver.archive();

    res.send(`${archivedEventsCount} events succesfully archived 🍇`);
  });
}

/*
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

    },
    eventsLimit: Archiver.eventsLimit

  });
});

module.exports = router;
