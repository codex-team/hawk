var express = require('express');
var router = express.Router();
var mongo = require("../modules/database");
var email = require("../modules/email");

var db_collection = "hawk_websites";

/* Show page for new app registration */
router.get('/create', function(req, res, next) {
  res.render('websites/create', { title: 'Register new website' });
});

/* App registration callback */
router.post('/create', function(req, res, next) {

    var name = req.body.app_name;

    if (!name) {
        res.render('websites/result', {title: 'Error', error: "Website domain is empty"});
        return;
    }

    /* Check if application is already exists */
    checkApplicationName(name).then(function(result) {

        /* if not exists -> generate token and add to DB*/
        if (result) {
            var uuid = require('uuid');
            var token = uuid.v4();
            addNewApplication(name, token);
            res.render('websites/result', {title: 'Get your token', token: token});
        }
        else {
            res.render('websites/result', {title: 'Error', error: "Website already connected"});
        }
    })

});

/* Return if application with name specified is not exists */
function checkApplicationName(name) {
    return mongo.findOne(db_collection, {'name': name})
        .then(function (result) {
            if (result) {
                return false;
            }
            else {
                return true;
            }
        });
}

/* Add new application and token to DB */
function addNewApplication(app_name, token) {
    return mongo.insertOne(db_collection, {'name': app_name, 'token': token})
        .then(function (result) {
            if (result) {
                email.init();
                email.send(
                    {name:'CodeX Hawk', email:'codex.ifmo@yandex.ru'},
                    'ntpcp@yandex.ru',
                    'Your token',
                    'Your access token: ' + token,
                    '');
                return true;
            }
            else {
                return false;
            }
        });
}


module.exports = router;
