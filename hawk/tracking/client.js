let WebSocket = require('ws');

let reciever = new WebSocket.Server({
  path: '/catcher/client',
  port: 8000
});

var connection = function(ws) {
  /**
   * TODO: authorization
   */

  let receiveMessage = function (message) {

    message = JSON.parse(message);
    console.log(message)

  };

  ws.on('message', receiveMessage)

};

reciever.on('connection', connection);
