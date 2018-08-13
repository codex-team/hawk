let express  = require('express');
let router = express.Router();
let events   = require('../../models/events');
let notifies = require('../../models/notifies');
let project = require('../../models/project');

const BaseCatcher = require('./base-catcher');

/**
 * Server-side receiver for Scala's exceptions.
 * It takes the following params in request:
 *
 * @typedef ErrorStackElement
 * @type {object}
 * @property {string} file - file with error
 * @property {string} line - line with error
 *
 * @param {string} req.body.token - application token
 * @param {string} req.body.message - error message
 * @param {JSON.<Array.<ErrorStackElement>>} req.body.stack - error stack in JSON format

 * @param {string} req.body.time - time in ISO format
 * @param {string} req.body.comment - custom error description
 */
let getNodeJsErrors = function (req, res) {

  let request = req.body,
    parsedStack = JSON.parse(request.stack);

  let errorLocation = (parsedStack) ? parsedStack[0] : '';

  let event = {
    type          : 'scala',
    tag           : 'fatal',
    message       : request.message,
    errorLocation : errorLocation,
    groupHash     : BaseCatcher.md5(request.message),
    stack         : parsedStack,
    time          : new Date(request.time).getTime() / 1000,
    token         : request.token,
    comment       : request.comment
  };

  project.getByToken(event.token)
    .then( function (foundProject) {
      if (!foundProject) {
        res.sendStatus(403);
        return;
      }

      return events.add(foundProject._id, event)
        .then(function () {
          return foundProject;
        });
    })
    .then(function (foundProject) {
      if (!foundProject) {
        return;
      }

      notifies.send(foundProject, event);

      res.sendStatus(200);
    })
    .catch( function () {
      res.sendStatus(500);
    });
};

/**
 * Convert text error stack to an array of the following params:
 *  func – function name
 *  file – file name
 *  line – error line
 *  col  – error column
 *
 * @param {String} stack – error stack
 * @returns {{file: String, func: String, line: Number, col: Number}[]} – array of each stack's line descriptions
 */
let parseErrorStack = function (stack) {
  const REGEX = /^\s*at (.*?) ?\(?(\S+):(\d+):(\d+)\)?/m;

  let filtered = stack.split('\n').filter(function (line) {
    return REGEX.test(line);
  });

  return filtered.map(function (line) {
    let matches = REGEX.exec(line);

    return {
      func: matches[1],
      file: matches[2],
      line: matches[3],
      col: matches[4]
    };
  });
};

/* GET Scala errors. */
router.post('/scala', getNodeJsErrors);

/* Error handler for the Scala catcher */
router.use(function(err, req, res, next) {
  console.log("Error in Scala catcher: ", err);
  global.catchException(error);
  res.sendStatus(500);
});


module.exports = router;

