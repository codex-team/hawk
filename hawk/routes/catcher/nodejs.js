let express  = require('express');
let router = express.Router();
let events   = require('../../models/events');
let notifies = require('../../models/notifies');
let stack = require('../../modules/stack');
let Crypto = require('crypto');
let project = require('../../models/project');

let md5 = function (input) {
  return Crypto.createHash('md5').update(input, 'utf8').digest('hex');
};

let normalizeTag = function (tag) {
  const tags = ['fatal', 'warnings', 'notice'];
  if (tags.indexOf(tag) > -1) {
    return tag;
  } else {
    return 'fatal';
  }
};

let getFullDescription = function (stackElement) {
  return stackElement.file + ' -> ' + stackElement.line + ':' + stackElement.col;
};

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
        full: getFullDescription(stackParsed[0])
      };

  let event = {
    type          : 'nodejs',
    name          : request.name,
    tag           : normalizeTag(request.tag),
    token         : request.token,
    message       : request.message,
    comment       : request.comment,
    stack         : stackParsed,
    errorLocation : errorLocation,
    groupHash     : md5(eventGroupPrehashed),
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

/* GET nodejs errors. */
router.post('/nodejs', getNodeJsErrors);

module.exports = router;
