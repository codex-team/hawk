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

let getStack = function (backtrace) {

  backtrace = backtrace.pop();

  let file = backtrace.file,
      line = backtrace.line,
      func = backtrace.function,
      obj  = backtrace.object,
      cls  = backtrace.class,
      type = backtrace.type,
      args = backtrace.args;

  let stack = file+ '(' + line + '): ';

  switch (type) {

    case '->':
      stack += obj + type + func;
      break;

    case '::':
      stack += cls + type + func;
      break;

    default:
      stack += func;

  }

  if (args.length) {

    let argsString = '(';
    for (let i = 0; i < args.length; i++) {

      argsString += args[i];

      argsString += (i == args.length - 1 ? ')' : ',');

    }

    stack += argsString;
    return stack;

  }

  stack += '()';
  return stack;

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

  let response = req.body,
    location = response.error_file + response.error_line;

  let event = {
    type: 'php',
    tag: tags[response.error_type],
    token: response.access_token,
    groupHash: md5(location),
    message: response.error_description,
    stack: getStack(response.debug_backtrace),
    time: response.error_context._SERVER.REQUEST_TIME,
    errorLocation: {
      file: response.error_file,
      line: response.error_line,
      full: response.error_file + ' -> ' + response.error_line
    },
    params: {
      post: response.error_context._POST,
      get : response.error_context._GET
    },
    location: {
      url: response.error_context._SERVER.SERVER_NAME + response.error_context._SERVER.QUERY_STRING,
      host: response.error_context._SERVER.SERVER_NAME,
      path: response.error_context._SERVER.QUERY_STRING,
    },
    request: {
      ip: response.error_context._SERVER.REMOTE_ADDR,
      method: response.error_context._SERVER.REQUEST_METHOD,
      referer: response.error_context._SERVER.HTTP_REFERER,
    }
  };

  websites.get(event.token, event.location.host)
    .then( function (site) {

      if (!site) {

        res.sendStatus(403);
        return;

      }
      return user.get(site.user)
        .then(function (foundUser) {

          notifies.send(foundUser, event.location.host, event);

          events.add(event.location.host, event)
            .then(function () {

              res.sendStatus(200);

            })
            .catch(function (e) {

              console.log('Can not add event because of ', e);
              res.sendStatus(500);

            });

        });


    })
    .catch( function () {

      res.sendStatus(500);

    });

};

/* GET server errors. */
router.post('/php', getServerErrors);

module.exports = router;
