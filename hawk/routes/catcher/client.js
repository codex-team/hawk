let events   = require('../../models/events');
let websites = require('../../models/websites');
let notifies = require('../../models/notifies');
let user = require('../../models/user');
let WebSocket = require('ws');
let Crypto = require('crypto');

let md5 = function (input) {

  return Crypto.createHash('md5').update(input, 'utf8').digest('hex');

};

/* GET client errors. */
let reciever = new WebSocket.Server({
  path: '/catcher/client',
  port: process.env.SOCKET_PORT
});

let connection = function (ws) {

  function getClientErrors(message) {

    let location = message.error_location.file + ':' + message.error_location.line + ':' + message.error_location.col;

    message.error_location.full = message.error_location.file + ' -> ' +
                                  message.error_location.line + ':' +
                                  message.error_location.col;

    let event = {
      type          : 'client',
      tag           : 'javascript',
      message       : message.message,
      errorLocation : message.error_location,
      location      : message.location,
      stack         : parseStack(message),
      groupHash     : md5(location),
      userAgent     : message.navigator,
      time          : Math.floor(message.time / 1000)
    };

    logger.info('Got javascript error from ' + event.location.host);

    websites.get(message.token, event.location.host)
      .then( function (site) {

        if (!site) {

          ws.send(JSON.stringify({type: 'warn', message: 'Access denied'}));
          ws.close();
          return;

        }

        return user.get(site.user)
          .then(function (foundUser) {

            notifies.send(foundUser, event.location.host, event);

            events.add(event.location.host, event)
              .catch(function (e) {

                logger.log('error', 'Can not add event because of ', e);

              });

          });

      })
      .catch( function (e) {

        ws.send(JSON.stringify({type: 'error', message: e.message}));

      });

  }

  let receiveMessage = function (message) {

    message = JSON.parse(message);
    getClientErrors(message);

  };

  ws.on('message', receiveMessage);

};

reciever.on('connection', connection);

let parseStack = function (event) {

  const REGEXPS = {
    FF_SAFARI_OPERA_11: /(.*)@(\S+)\:(\d+):(\d+)/,
    CHROME_IE: /^\s*at (.*) \((\S+):(\d+):(\d+)\)/m,
    SAFARI_NATIVE: /^(eval@)?(\[native code\])?$/,
    OPERA_9: /Line (\d+).*script (?:in )?(\S+)/i,
    OPERA_10: /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i,
  };

  let stack = event.stack;

  let parseChromeIE = function () {

    let filtered = stack.split('\n').filter(function (line) {

      return REGEXPS.CHROME_IE.test(line) && !/^Error created at/.test(line);

    });

    return filtered.map(function (line) {

      if (/eval/.test(line)) {

        /* Replace eval calls to expected format */
        line = line.replace(/eval \(/, '').replace(/, .*:\d+:\d+\)/, '');

      }

      let matches = REGEXPS.CHROME_IE.exec(line);

      return {
        func: matches[1],
        file: matches[2],
        line: matches[3],
        col: matches[4]
      };

    });

  };
  let parseSafariOpera11FF = function () {

    let filtered = stack.split('\n').filter(function (line) {

      return !/^Error created at/.test(line) && !REGEXPS.SAFARI_NATIVE.test(line) && REGEXPS.FF_SAFARI_OPERA_11.test(line);

    });

    return filtered.map(function (line) {

      let matches = REGEXPS.FF_SAFARI_OPERA_11.exec(line);

      return {
        func: matches[1],
        file: matches[2],
        line: matches[3],
        col: matches[4]
      };

    });

  };
  let parseOpera9 = function () {

    let filtered = event.message.split('\n').filter(function (line) {

      return REGEXPS.OPERA_9.test(line);

    });

    return filtered.map(function (line) {

      let matches = REGEXPS.OPERA_9.exec(line);

      return {
        file: matches[2],
        line: matches[1]
      };

    });

  };

  let parseOpera10 = function () {

    let filtered = stack.split('\n').filter(function (line) {

      return REGEXPS.OPERA_10.test(line);

    });


    return filtered.map(function (line) {

      let matches = REGEXPS.OPERA_9.exec(line);

      return {
        func: matches[3] || undefined,
        file: matches[2],
        line: matches[1]
      };

    });

  };

  if (REGEXPS.OPERA_9.test(event.message)) {

    stack = parseOpera9();

  } else if (REGEXPS.OPERA_10.test(stack)) {

    stack = parseOpera10();

  } else if (REGEXPS.CHROME_IE.test(stack)) {

    stack = parseChromeIE();

  } else if (REGEXPS.FF_SAFARI_OPERA_11.test(stack)) {

    stack = parseSafariOpera11FF();

  } else {

    console.log('Can\'t parse this ****');
    stack = stack.split('\n').map(function (line) {

      return {
        file: line
      };

    });

  }

  return stack;

};