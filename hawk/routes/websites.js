var express = require('express');
var router = express.Router();
var mongo = require('../modules/database');
var email = require('../modules/email');
var db_collection = 'hawk_websites';

/* Show page for new app registration */
router.get('/create', function(req, res, next) {
  res.render('yard/websites/create', { title: 'Register new website' });
});

/* App registration callback */
router.post('/create', function(req, res, next) {

    'use strict';

    /**
     * Register site template
     * @type {String}
     */
    let resultTemplate = 'yard/websites/result';

    var name = req.body.app_name;

    if (!name) {
        res.render(resultTemplate, {title: 'Error', error: "Website domain is empty"});
        return;
    }

    /* Check if application is already exists */
    checkApplicationName(name).then(function(result) {

        /* if not exists -> generate token and add to DB*/
        if (result) {
            var uuid = require('uuid');
            var client_token = uuid.v4();
            var server_token = uuid.v4();

            addNewApplication(name, client_token, server_token);
            res.render(resultTemplate, {
                title: 'Get your token',
                client_token: client_token,
                server_token: server_token
            });
        }
        else {
            res.render(resultTemplate, {title: 'Error', error: "Website already connected"});
        }
    });

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
function addNewApplication(app_name, client_token, server_token) {
    return mongo.insertOne(db_collection, {'name': app_name, 'client_token': client_token, 'server_token': server_token})
        .then(function (result) {
            if (result) {
                email.init();
                email.send(
                    {name:'CodeX Hawk', email:'codex.ifmo@yandex.ru'},
                    'ntpcp@yandex.ru',
                    'Your token',
                    'Your client access token: ' + client_token + '\n' + 'Your server access token: ' + server_token,
                    '');
                return true;
            }
            else {
                return false;
            }
        });
}


module.exports = router;
