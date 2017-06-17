let express = require('express');
let router = express.Router();

let event = require('./event');
let settings = require('./settings');
let index = require('./index');

router.use(event);
router.use(settings);
router.use(index);

module.exports = router;
