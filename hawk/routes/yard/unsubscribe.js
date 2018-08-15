'use strict';

let express = require('express');
let router = express.Router();
let notifies = require('../../models/notifies');

let unsbscribe = function (req, res, next) {
  try {
    let userId = req.query.user,
      projectId = req.query.project,
      hash = req.query.hash,
      type = req.query.type || 'email',
      success = true;

    const AVAILABLE_TYPES = ['email', 'tg', 'slack'];

    if (success && (!userId || !projectId || !hash || !AVAILABLE_TYPES.includes(type))) {
      success = false;
    }

    let generatedHash = notifies.generateUnsubscribeHash(userId, projectId);

    if (success && (hash !== generatedHash)) {
      success = false;
    }

    if (success) {
      notifies.unsubscribe(userId, projectId, type);
    }

    res.render('yard/unsubscribe/unsubscribe.twig', {
      success: success
    });
  } catch (e) {
    next(e)
  }
};

router.use('/', unsbscribe);

module.exports = router;
