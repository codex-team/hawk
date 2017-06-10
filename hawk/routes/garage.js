let express = require('express');
let router = express.Router();
let mongo = require('../modules/database');

let feed = function (req, res) {

  'use strict';

  let domain = req.params.domain,
      tab = req.params[0].split('/')[1],
      allowedTabs = ['fatal', 'warnings', 'notice', 'javascript'];

  /**
   * TODO: check if domain registered
   */
  if (!allowedTabs.includes(tab)) {
    res.sendStatus(400);
    return;
  }

  if (!tab.length) tab = null;

  let query = {};

  if (tab) {
    query.tag = tab;
  }

  mongo.find(domain, query).then(function(result) {

    res.render('garage/list', { title: domain + '/' + tab , errors: result});

  });

};

/**
 * Main page dashboard
 */
let main = function (req, res) {

  'use strict';
  res.render('garage/index', {});

};

router.get('/:domain*', feed);
router.get('/', main);

module.exports = router;