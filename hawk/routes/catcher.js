var express = require('express');
var database = require('../modules/database'); // Use Mongo
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

  let receiveMessage = function (message) {

    message = JSON.parse(message);
    getClientErrors(message);

  };

  ws.on('message', receiveMessage)

};

reciever.on('connection', connection);

function getClientErrors(message) {

  var query;

  var errorMessage  = message.message,
      errorLocation = message.error_location,
      location      = message.location,
      stack         = message.stack,
      userClient    = message.navigator;

    query = database.insertOne(location.host, {
      type         : 'client',
      errorMessage : errorMessage,
      location     : location,
      stack        : stack,
      userClient   : userClient
    });

}

/* GET server errors. */
router.post('/server', [getServerErrors]);

function getServerErrors(req, res, next) {
  response = req.body;

  var query;

  var tags = [ 'Parsing Error',
           'All errors occurred at once',
           'Warning',
           'Core Warning',
           'Compile Warning',
           'User Warning',
           'Error',
           'Core Error',
           'Compile Error',
           'User Error',
           'Recoverable error',
           'Notice',
           'User Notice',
           'Deprecated',
           'User Deprecated',
           'Strict Error'];

  let tag         = response.error_type,
      tagMessage  = tags[response.error_type],
      file        = response.error_file,
      description = response.error_description,
      line        = response.error_line,
      params      = {
        post  : response.error_context._POST,
        get   : response.error_context._GET
      },
      remoteADDR  = response.error_context._SERVER.REMOTE_ADDR,
      requestMethod = response.error_context._SERVER.REQUEST_METHOD,
      queryString = response.error_context._SERVER.QUERY_STRING,
      referer     = response.error_context._SERVER.HTTP_REFERER,
      serverName  = response.error_context._SERVER.SERVER_NAME,
      requestTime = response.error_context._SERVER.REQUEST_TIME,
      token       = response.access_token,
      backtrace   = response.debug_backtrace;

  database.findOne('hawk_websites', {
    client_token : token,
    name : serverName
  })
    .then( function() {
      query = database.insertOne(serverName, {
        type        : 'server',
        tag         : tag,
        tagMessage  : tagMessage,
        file        : file,
        message     : description,
        line        : line,
        params      : params,
        remoteADDR  : remoteADDR,
        requestMethod : requestMethod,
        queryString : queryString,
        referer     : referer,
        requestTime : requestTime,
        callStack   : backtrace
      });

      query.then(function(){
        res.sendStatus(200);
      }).catch(function(){
        res.sendStatus(500);
      });

    });

}

module.exports = router;
