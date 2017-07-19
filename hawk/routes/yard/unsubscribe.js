'use strict';

let express = require('express');
let router = express.Router();
let notifies = require('../../models/notifies');
let Crypto = require('crypto');

let unsbscribe = function (req, res) {

  let id = req.query.id,
      hash = req.query.hash;

  if (!id || !hash) {
    res.sendStatus(400);
    return;
  }

  let generatedHash = Crypto.createHash('sha256').update(id + process.env.SALT, 'utf8').digest('hex');

  if (hash != generatedHash) {
    res.sendStatus(400);
    return;
  };

  notifies.unsubscribe(id);
  res.sendStatus(200);

}

router.use('/', unsbscribe);

module.exports = router;

