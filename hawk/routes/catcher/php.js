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
let formatDebugBacktrace = function (debugBacktrace) {
  let result = [];

  /** Remove Hawk\HawkErrorManager::Log **/
  debugBacktrace.shift();

  for (let i = debugBacktrace.length - 1; i >= 0; i--) {
    result[i] = {
      'file': debugBacktrace[i].file,
      'line': debugBacktrace[i].line
    };

    let args = debugBacktrace[i].args;

    if (args) {
      debugBacktrace[i].function += '(' + args.slice(0, -1).join(', ') + args[args.length - 1] + ')';
    } else {
      debugBacktrace[i].function += '()';
    }

    switch (debugBacktrace[i]['type']) {
      case '::':
        result[i].func = debugBacktrace[i].class + '::' + debugBacktrace[i].function;
        break;
      case '->':
        result[i].func = debugBacktrace[i].object + '->' + debugBacktrace[i].function;
        break;
      default:
        result[i].func = debugBacktrace[i].function;
    }
  }

  return result;
};

let getServerErrors = function (req, res) {
  const tags = {
    1    : 'fatal',    // Error
    2    : 'warnings', // Warning
    4    : 'fatal',    // Parsing Error
    8    : 'notice',   // Notice
    16   : 'fatal',    // Core Error
    32   : 'warnings', // Core Warning
    64   : 'fatal',    // Compile Error
    128  : 'warnings', // Compile Warning
    256  : 'fatal',    // User Error
    512  : 'warnings', // User Warning
    1024 : 'notice',   // User Notice
    2048 : 'notice',   // Strict Error
    4096 : 'fatal',    // Recoverable error
    8192 : 'notice',   // Deprecated
    16384: 'notice',   // User Deprecated
  };

  let request = req.body,
      location = request.error_file + request.error_line;

  let event = {
    type: 'php',
    tag: tags[request.error_type],
    token: request.access_token,
    groupHash: md5(location),
    message: request.error_description,
    stack: formatDebugBacktrace(request.debug_backtrace),
    time: request.http_params.REQUEST_TIME,
    errorLocation: {
      file: request.error_file || '',
      line: request.error_line,
      full: request.error_file + ' -> ' + request.error_line
    },
    params: {
      post: request.error_context._POST || [],
      get : request.error_context._GET || []
    },
    location: {
      url: request.http_params.SERVER_NAME + request.http_params.QUERY_STRING,
      host: request.http_params.SERVER_NAME,
      path: request.http_params.QUERY_STRING,
    },
    request: {
      ip: request.http_params.REMOTE_ADDR,
      method: request.http_params.REQUEST_METHOD,
      referrer: request.http_params.HTTP_REFERRER,
    }
  };

  logger.info('Got php error from ' + event.location.host);

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

      return notifies.send(foundProject, event);
    })
    .catch( function () {
      res.sendStatus(500);
    });
};

/* GET server errors. */
router.post('/php', getServerErrors);

module.exports = router;
