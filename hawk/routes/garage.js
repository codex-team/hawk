let express = require('express');
let router = express.Router();

let index = require('./garage/index');
let settings = require('./garage/settings');
let event = require('./garage/event');

router.use(event);
router.use(settings);
router.use(index);

module.exports = router;
