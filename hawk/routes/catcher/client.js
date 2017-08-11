let events   = require('../../models/events');
let notifies = require('../../models/notifies');
let WebSocket = require('ws');
let Crypto = require('crypto');
let stack = require('../../modules/stack');
let project = require('../../models/project');

let md5 = function (input) {
  return Crypto.createHash('md5').update(input, 'utf8').digest('hex');
};

/* GET client errors. */
let receiver = new WebSocket.Server({
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
      stack         : stack.parse(message),
      groupHash     : md5(location),
      userAgent     : message.navigator,
      time          : Math.floor(message.time / 1000)
    };

    logger.info('Got javascript error from ' + event.location.host);

    project.getByToken(message.token)
      .then( function (foundProject) {
        if (!foundProject) {
          ws.send(JSON.stringify({type: 'warn', message: 'Access denied'}));
          ws.close();
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
      .catch( function (e) {
        logger.log('Error while saving client error ', e);
        ws.send(JSON.stringify({type: 'error', message: e.message}));
      });
  }

  let receiveMessage = function (message) {
    console.log('Client catcher recieved a message: %o', message);

    message = JSON.parse(message);
    getClientErrors(message);
  };

  ws.on('message', receiveMessage);
};

receiver.on('connection', connection);
