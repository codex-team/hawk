let express = require('express');
let router = express.Router();

let index = require('./index');
let settings = require('./settings');
let event = require('./event');

router.use(event);
router.use(settings);
router.use(index);

module.exports = router;
