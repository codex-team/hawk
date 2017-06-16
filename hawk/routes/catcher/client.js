let events   = require('../../models/events');
let websites = require('../../models/websites');
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

let connection = function(ws) {
  /**
   * TODO: authorization
   */


  function getClientErrors(message) {

    let location = message.error_location.file + ':' + message.error_location.line + ':' + message.error_location.col;
    let event = {
      type          : 'client',
      tag           : 'javascript',
      message       : message.message,
      errorLocation : message.error_location,
      location      : message.location,
      stack         : message.stack,
      groupHash     : md5(location),
      userClient    : message.navigator,
      time          : Math.floor(message.time / 1000)
    };

    websites.get(message.token, event.location.host)
      .then( function(site) {
        if (!site) {
          ws.send(JSON.stringify({type: 'warn', message: 'Access denied'}));
          ws.close();
          return;
        }

        events.add(event.location.host, event);

      })
      .catch( function() {
        // handle
      })

  }

  let receiveMessage = function (message) {

    message = JSON.parse(message);
    getClientErrors(message);

  };

  ws.on('message', receiveMessage)

};

reciever.on('connection', connection);