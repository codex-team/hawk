let express = require('express');
let router = express.Router();
let mongo = require('../modules/database');

let feed = function (req, res) {

  let domain = req.params.domain,
      tab = req.params[0].split('/')[1],
      allowedTabs = ['fatal', 'warnings', 'notice', 'javascript'];

  /**
   * TODO: check if domain registered
   */

  if (!(allowedTabs.indexOf(tab) + 1)) {
    res.sendStatus(400);
    return;
  }

  if (!tab.length) tab = null;

  let query = {};
  if (tab) {
    query.tag = tab;
  }

  mongo.find(domain, query).then(function(result) {

    res.render('list', { title: domain + '/' + tab , errors: result});

  });

};

router.get('/:domain*', feed);

module.exports = router;