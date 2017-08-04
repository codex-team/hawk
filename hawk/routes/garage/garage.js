let express = require('express');
let router = express.Router();

let event = require('./event');
let settings = require('./settings');
let index = require('./index');
let project = require('./project');

router.use(function (req, res, next) {
  /**
   * #TODO
   * Show 'join or log in' page
   */
  if (!res.locals.user) {
    res.redirect('/login');
    return;
  }

  next();
});

router.use(event);
router.use(settings);
router.use(index);
router.use(project);

module.exports = router;
