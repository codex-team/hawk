var express = require('express');
var router = express.Router();
var events = require('../modules/events');
var mongo = require('../modules/database');

var db_collection = "hawk_websites";

/* Show page for new app registration */
router.get('/create', function(req, res, next) {
  res.render('create', { title: 'Register new website' });
});

/* App registration callback */
router.post('/create', function(req, res, next) {

    var name = req.body.app_name;

    if (!name) {
        res.render('token', {title: 'Error', error: "Website domain is empty"});
        return;
    }

    /* Check if application is already exists */
    events.checkApplicationName(name)
      .then(function(result) {
        /* if not exists -> generate token and add to DB*/
        if (result) {
            var uuid = require('uuid');
            var token = uuid.v4();
            events.addNewApplication(name, token);
            res.render('token', {title: 'Get your token', token: token});
        }
        else {
            res.render('token', {title: 'Error', error: "Website already connected"});
        }
    });

});

module.exports = router;
