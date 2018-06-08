let express = require('express');
let router = express.Router();

let event = require('./event');
let settings = require('./settings');
let index = require('./index');
let project = require('./project');

router.use(function (req, res, next) {
  /**
   * If user is not authorized then set redirect cookie
   * and show sign in form
   */
  if (!res.locals.user) {
    /**
     * Use originalUrl as redirect url
     *
     * req.url                /<project>/event/<event>
     * req.baseUrl     /garage
     * req.originalUrl /garage/<project>/event/<event>
     */
    res.cookie('redirect', req.originalUrl);
    res.redirect('/login');
    return;
  }

  next();
});

router.use(project);
router.use(event);
router.use(settings);
router.use(index);

module.exports = router;
