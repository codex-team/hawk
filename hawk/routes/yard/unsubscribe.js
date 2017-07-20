'use strict';

let express = require('express');
let router = express.Router();
let notifies = require('../../models/notifies');

let unsbscribe = function (req, res) {

  let id = req.query.id,
      hash = req.query.hash,
      success = true;

  if (success && (!id || !hash)) {
    success = false;
  }

  let generatedHash = notifies.generateUnsubscribeHash(id);

  if (success && (hash != generatedHash)) {
    success = false;
  }

  if (success) {
    notifies.unsubscribe(id);
  }

  res.render('yard/unsubscribe/unsubscribe.twig', {
    success: success
  });

};

router.use('/', unsbscribe);

module.exports = router;

