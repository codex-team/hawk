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

  type = response.error_type;
  file = response.error_file;
  description = response.error_description;
  line = response.error_line;
  token = response.access_token;
  backtrace = response.debug_backtrace;

  console.log(database);
  res.sendStatus(200);

}

module.exports = router;
