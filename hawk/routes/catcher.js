var express  = require('express');
var database = require('../modules/database'); // Use Mongo
var events   = require('../models/events');
var websites = require('../models/websites');
var router = express.Router();
var WebSocket = require('ws');

/* GET client errors. */
let reciever = new WebSocket.Server({
  path: '/catcher/client',
  port: 8000
});

var connection = function(ws) {
  /**
   * TODO: authorization
   */


  function getClientErrors(message) {

    let event = {
      type          : 'client',
      tag           : 'javascript',
      message       : message.message,
      errorLocation : message.error_location,
      location      : message.location,
      stack         : message.stack,
      userClient    : message.navigator,
      time          : message.time
    };

    websites.get('client', message.token, event.location.host)
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


/* GET server errors. */
router.post('/server', [getServerErrors]);

function getServerErrors(req, res, next) {

   const tags = {
    1    : 'fatal',    //Error
    2    : 'warnings', //Warning
    4    : 'fatal',    //Parsing Error
    8    : 'notice',   //Notice
    16   : 'fatal',    //Core Error
    32   : 'warnings', //Core Warning
    64   : 'fatal',    //Compile Error
    128  : 'warnings', //Compile Warning
    256  : 'fatal',    //User Error
    512  : 'warnings', //User Warning
    1024 : 'notice',   //User Notice
    2048 : 'notice',   //Strict Error
    4096 : 'fatal',    //Recoverable error
    8192 : 'notice',   //Deprecated
    16384: 'notice',   //User Deprecated
  };

  response = req.body;


  let event = {
      type        : 'server',
      tag         : tags[response.error_type],
      file        : response.error_file,
      message     : response.error_description,
      line        : response.error_line,
      params      : {
        post  : response.error_context._POST,
        get   : response.error_context._GET
      },
      remoteADDR    : response.error_context._SERVER.REMOTE_ADDR,
      requestMethod : response.error_context._SERVER.REQUEST_METHOD,
      queryString   : response.error_context._SERVER.QUERY_STRING,
      referer       : response.error_context._SERVER.HTTP_REFERER,
      serverName    : response.error_context._SERVER.SERVER_NAME,
      time          : response.error_context._SERVER.REQUEST_TIME,
      token         : response.access_token,
      backtrace     : response.debug_backtrace
  };

  websites.get('server', event.token, event.serverName)
    .then( function(sites) {

      if (!sites) {
        res.sendStatus(403);
        return;
      }

      events.add(event.serverName, event);

      res.sendStatus(200);

    })
    .catch( function() {
      res.sendStatus(500);
    });

}

module.exports = router;
