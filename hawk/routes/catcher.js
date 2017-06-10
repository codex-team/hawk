var express = require('express');
var router = express.Router();

/* GET client errors. */
router.get('/client', function(req, res, next) {
  res.render('index', { title: 'Client errors' });
});

/* GET server errors. */
router.get('/server', function(req, res, next) {
  res.render('index', { title: 'Server errors' });
});


module.exports = router;
