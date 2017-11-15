let express  = require('express');
let router = express.Router();

/**
 * To add new catcher, create new file in /routes/catcher.
 * Set there routes end export router. Require it here and use router.use().
 *
 * You should lead event data to unfied format that MUST include these fields:
 *
 * - type          -- your catcher type (for example: client, php, python)
 * - tag           -- one of supported tags (javascript, fatal, warnings, notice)
 * - message       -- error message
 * - errorLocation -- object with file, line (maybe column) where error is located
 *    - full       -- full path to error (for example 'index.js->10:23')
 * - groupHash     -- hash to group same events
 * - stack         -- error backtrace as string
 * - time          -- fall timestamp
 *
 * If you need other information, feel free to add it
 *
 */

let client = require('./client');
let php = require('./php');
let python = require('./python');
let android = require('./android');


router.use(php);
router.use(python);
router.use(android);

module.exports = router;
