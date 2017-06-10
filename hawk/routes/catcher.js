var express = require('express');
var router = express.Router();

/* GET client errors. */
router.get('/client', function(req, res, next) {
  res.render('index', { title: 'Client errors' });
});

/* GET server errors. */
router.post('/server', [getServerErrors, sendStatus]);

function getServerErrors(req, res, next) {
  response = req.body;

  type = response.error_type;
  file = response.error_file;
  description = response.error_description;
  line = response.error_line;
  token = response.access_token;
  backtrace = response.debug_backtrace;

  if (token) {
    next(403);
  } else {
    next(500)
  }

}

function sendStatus(req, res) {
  res.sendStatus(200);
}

module.exports = router;
