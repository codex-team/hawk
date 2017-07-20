'use strict';

let express = require('express');
let router = express.Router();
let notifies = require('../../models/notifies');

let unsbscribe = function (req, res) {

  let id = req.query.id,
      hash = req.query.hash;

  if (!id || !hash) {
    res.sendStatus(400);
    return;
  }

  let generatedHash = notifies.generateUnsubscribeHash(id);

  if (hash != generatedHash) {
    res.sendStatus(400);
    return;
  }

  notifies.unsubscribe(id);
  res.sendStatus(200);

};

router.use('/', unsbscribe);

module.exports = router;

