var express = require('express');
var database = require('../modules/database'); // Use Mongo
var router = express.Router();

/* GET client errors. */
router.get('/client', function(req, res, next) {
  res.render('index', { title: 'Client errors' });
});

/* GET server errors. */
router.post('/server', [getServerErrors]);

function getServerErrors(req, res, next) {
  response = req.body;

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
      requestTime = response.error_context._SERVER.REQUEST_TIME,
      token       = response.access_token,
      backtrace   = response.debug_backtrace;

  database.findOne('hawk_applications', { token : token })
    .then(function(result) {

      if (result.name != response.error_context._SERVER.SERVER_NAME) {
        return;
      }

      query = database.insertOne(result.name, {
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
