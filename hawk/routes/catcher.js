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

  tag = response.error_type;
  tagMessage = tags[response.error_type];
  file = response.error_file;
  description = response.error_description;
  line = response.error_line;
  token = response.access_token;
  backtrace = response.debug_backtrace;

  query = database.insertOne('http://hawk.ifmo.su', {
    type        : 'server',
    tag         : tag,
    tagMessage  : tagMessage,
    file        : file,
    message     : description,
    line        : line,
    callStack   : backtrace
  });

  query.then(function(){
    res.sendStatus(200);
  }).catch(function(){
    res.sendStatus(500);
  });

}

module.exports = router;
