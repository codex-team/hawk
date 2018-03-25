let express  = require('express');
let router = express.Router();
let events   = require('../../models/events');
let notifies = require('../../models/notifies');
let stack = require('../../modules/stack');
const BaseCatcher = require('./base-catcher');
let project = require('../../models/project');

let base_catcher = new BaseCatcher();

/**
 * Convert text error stack to an array of the following params:
 *  func – function name
 *  file – file name
 *  line – error line
 *  col  – error column
 *
 * @param {String} stack – error stack
 * @returns {Array} – array of each stack's line descriptions
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

/**
 * Server-side receiver for Nodejs's exceptions.
 * It takes followings json params in request:
 *
 * @param req.body.token
 * @param req.body.domain
 * @param req.body.type
 * @param req.body.description
 * @param req.body.stack
 */
let getNodeJsErrors = function (req, res) {
  let request = req.body,
    eventGroupPrehashed = request.message;

  let stackParsed = parseErrorStack(request.stack),
      errorLocation = {
        line: stackParsed[0].line,
        file: stackParsed[0].file,
        col: stackParsed[0].col,
        full: BaseCatcher.getFullDescription(stackParsed[0])
      };

  let event = {
    type          : 'nodejs',
    name          : request.name,
    tag           : BaseCatcher.normalizeTag(request.tag),
    token         : request.token,
    message       : request.message,
    comment       : request.comment,
    stack         : stackParsed,
    errorLocation : errorLocation,
    groupHash     : BaseCatcher.md5(eventGroupPrehashed),
    time          : request.time
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

/* GET Node.js errors. */
router.post('/nodejs', getNodeJsErrors);

module.exports = router;
