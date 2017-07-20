let express  = require('express');
let router = express.Router();
let events   = require('../../models/events');
let websites = require('../../models/websites');
let user = require('../../models/user');
let notifies = require('../../models/notifies');
let Crypto = require('crypto');

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
  let request = req.body,
    location = request.errorLocation.file + ':' + request.errorLocation.line,
    host = request.domain;

  let event = {
    type          : 'python',
    tag           : 'fatal',
    token         : request.token,
    message       : request.message,
    errorLocation : request.errorLocation,
    stack         : request.stack,
    groupHash     : md5(location),
    time          : request.time
  };

  websites.get(event.token, host)
    .then( function (site) {
      if (!site) {
        res.sendStatus(403);
        return;
      }
      return user.get(site.user)
        .then(function (foundUser) {
          notifies.send(foundUser, host, event);

          events.add(host, event)
            .then(function () {
              res.sendStatus(200);
            })
            .catch(function (e) {
              logger.error('Can not add event because of ', e);
              res.sendStatus(500);
            });
        });
    })
    .catch( function () {
      res.sendStatus(500);
    });
};

/* GET python errors. */
router.post('/python', getPythonErrors);

module.exports = router;
