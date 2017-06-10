var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    userId: userId,
    title: 'Main page'
  });
});

module.exports = router;
