var express = require('express');
var router = express.Router();
var mongo = require("../modules/database");

/* Show page for new app registration */
router.get('/create', function(req, res, next) {
  res.render('create', { title: 'Register new application' });
});

/* App registration callback */
router.post('/create', function(req, res, next) {

    var name = req.body.app_name;

    if (!name) {
        res.render('token', {title: 'Error', error: "Name is empty"});
        return;
    }

    /* Check if application is already exists */
    checkApplicationName(name).then(function(result) {

        /* if not exists -> generate token and add to DB*/
        if (result) {
            var uuid = require('uuid');
            var token = uuid.v4();
            addNewApplication(name, token);
            res.render('token', {title: 'Get your token', token: token});
        }
        else {
            res.render('token', {title: 'Error', error: "User already exists"});
        }
    })

});

/* Return if application with name specified is not exists */
function checkApplicationName(name) {
    return mongo.findOne('hawk_applications', {'name': name})
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
    return mongo.insertOne('hawk_applications', {'name': app_name, 'token': token})
        .then(function (result) {
            if (result) {
                return false;
            }
            else {
                return true;
            }
        });
}



module.exports = router;
