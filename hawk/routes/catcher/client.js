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

<<<<<<< HEAD
  console.log("WebSocket reciever connected...");

  /**
   * TODO: authorization
   */


=======
>>>>>>> master
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
      stack         : message.stack,
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

        ws.send(JSON.stringify({type: 'error', message: e.message}))

      });

  }

  let receiveMessage = function (message) {

    console.log("Client catcher recieved a message: %o", message);

    message = JSON.parse(message);
    getClientErrors(message);

  };

  ws.on('message', receiveMessage);

};

reciever.on('connection', connection);
