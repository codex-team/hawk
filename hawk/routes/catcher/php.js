let express  = require('express');
let router = express.Router();
let events   = require('../../models/events');
let websites = require('../../models/websites');
let Crypto = require('crypto');

let md5 = function (input) {
  return Crypto.createHash('md5').update(input, 'utf8').digest('hex');
};

/* GET server errors. */
router.post('/php', [getServerErrors]);

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

  let response = req.body,
    location = response.error_file + response.error_line;



  let event = {
    type        : 'server',
    tag         : tags[response.error_type],
    errorLocation: {
      file: response.error_file,
      line: response.error_line
    },
    params: {
      post: response.error_context._POST,
      get : response.error_context._GET
    },
    message       : response.error_description,
    remoteADDR    : response.error_context._SERVER.REMOTE_ADDR,
    requestMethod : response.error_context._SERVER.REQUEST_METHOD,
    queryString   : response.error_context._SERVER.QUERY_STRING,
    referer       : response.error_context._SERVER.HTTP_REFERER,
    serverName    : response.error_context._SERVER.SERVER_NAME,
    time          : response.error_context._SERVER.REQUEST_TIME,
    token         : response.access_token,
    backtrace     : response.debug_backtrace,
    groupHash     : md5(location)
  };

  websites.get(event.token, event.serverName)
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
