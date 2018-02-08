let express  = require('express');
let router = express.Router();
let events   = require('../../models/events');
let notifies = require('../../models/notifies');
let Crypto = require('crypto');
let project = require('../../models/project');

let md5 = function (input) {
  return Crypto.createHash('md5').update(input, 'utf8').digest('hex');
};

/**
 * Server-side receiver for Python's exceptions.
 * It takes followings json params in request:
 *
 * @param req.body.token
 * @param req.body.domain
 * @param req.body.message
 * @param req.body.errorLocation.file
 * @param req.body.errorLocation.line
 * @param req.body.errorLocation.full
 * @param req.body.stack
 * @param req.body.time
 */
let getPythonErrors = function (req, res) {
  global.logger.debug('Python catcher received an Event');
  let request = req.body,
      eventGroupPrehashed = request.message;

  let event = {
    type          : 'python',
    tag           : 'fatal',
    token         : request.token,
    message       : request.message,
    errorLocation : request.errorLocation,
    stack         : request.stack,
    groupHash     : md5(eventGroupPrehashed),
    time          : request.time
  };

  global.logger.debug('Python catcher parsed an Event');

  project.getByToken(event.token)
    .then( function (foundProject) {
      if (!foundProject) {
        global.logger.debug('Python catcher returns 403');
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

      global.logger.debug('Python catcher tries to send a Notify');
      notifies.send(foundProject, event);

      global.logger.debug('Python catcher returns 200');
      res.sendStatus(200);
    })
    .catch( function (error) {
      global.logger.debug('Python catcher returns 500');
      global.logger.debug(error);
      res.sendStatus(500);
    });
};

/* GET python errors. */
router.post('/python', getPythonErrors);

module.exports = router;
