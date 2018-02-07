let express = require('express');
let router = express.Router();
let events = require('../../models/events');
let notifies = require('../../models/notifies');
let crypto = require('crypto');
let project = require('../../models/project');

let md5 = function (input) {
  return crypto.createHash('md5').update(input, 'utf8').digest('hex');
};

/**
 *  Lead php debug_backtrace to custom stack format
 *
 * @param {Object[]} debugBacktrace
 * @param {String} debugBacktrace[].function — current function name
 * @param {Number} debugBacktrace[].line — current line number
 * @param {String} debugBacktrace[].file — current file name
 * @param {String} debugBacktrace[].class — current class name, if current function is a class method
 * @param {String} debugBacktrace[].object — current object of a class, if current function is a method
 * @param {String} debugBacktrace[].type — current call type.
 *                                         '->' for class method, '::' for static class method, nothing for a function call
 * @param {*[]} debugBacktrace[].args — list of function arguments
 *
 * @returns {{file: String, func: String, line: Number}[]} formatted stack
 *
 */
let formatStack = function (debugBacktrace) {
  let result = [];
  let res = debugBacktrace.split('\n');
  for (let i = 0; i < res.length - 1; i++) {
    var location = res[i].match(/\(.*\)/).toString();
    location = location.substr(1, location.length - 2);
    location = location.replace(new RegExp(':', 'g'), ', ');
    result[i] = {
      'error': res[i].split(/\(.*\)/)[0],
      'location': location
    };
  }
  return result;
};

/**
 * Server-side receiver for Java's exceptions.
 * It takes followings json params in request:
 *
 * @param req
 * @param res
 */
let getAndroidErrors = function (req, res) {
  global.logger.debug('Android catcher got en error');
  let request = req.body,
    eventGroupPrehashed = request.message;
  let event = {
    type: 'android',
    language: request.language,
    tag: 'fatal',
    token: request.token,
    message: request.message,
    deviceInfo: {
      brand: request.deviceInfo.brand,
      device: request.deviceInfo.device,
      model: request.deviceInfo.model,
      product: request.deviceInfo.product,
      SDK: request.deviceInfo.SDK,
      release: request.deviceInfo.release,
      screenSize: request.deviceInfo.screenSize
    },
    stack: formatStack(request.stack),
    groupHash: md5(eventGroupPrehashed),
    time: request.time
  };

  global.logger.debug('Android catcher parsed en error data');

  project.getByToken(event.token)
    .then(function (foundProject) {
      if (!foundProject) {
        global.logger.debug('Android catcher returns 403');
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
      global.logger.debug('Android catcher returns 200');
    })
    .catch(function (error) {
      res.sendStatus(500);
      global.logger.debug('Android catcher returns 500');
      global.logger.debug(error);
    });
};

/* GET android errors. */
router.post('/android', getAndroidErrors);

module.exports = router;
