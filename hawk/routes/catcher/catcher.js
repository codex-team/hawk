let express  = require('express');
let router = express.Router();

let client = require('./client');
let php = require('./php');

router.use(php);

module.exports = router;