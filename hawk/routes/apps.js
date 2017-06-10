var express = require('express');
var router = express.Router();

/* Show page for new app registration */
router.get('/create', function(req, res, next) {
  res.render('create', { title: 'Register new application' });
});

/* App registration callback */
router.post('/create', function(req, res, next) {

    var name = req.body.app_name;

    if (checkApplicationName(name)) {
        var uuid = require('uuid');
        var token = uuid.v4();
        res.render('token', { title: 'Your token', token: token });
    }
    else {
        res.render('token', { title: 'Your token', error: "Invalid name" });
    }

});


function checkApplicationName(name) {
    console.log(name, name == '', name.length);
    if (name != "") {
        return true;
    }
    else {
        return false;
    }
}



module.exports = router;
