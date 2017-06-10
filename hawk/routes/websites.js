var express = require('express');
var router = express.Router();
var websites = require('../models/websites');

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

    if (!userId) {
        res.redirect("/login");
        return;
    }

    var name = req.body.app_name;

    if (!name) {
        res.render('yard/websites/result', {title: 'Error', error: "Website domain is empty"});
        return;
    }

    /* Check if application is already exists */
    websites.checkName(name)
      .then(function(result) {
        /* if not exists -> generate token and add to DB*/
        if (result) {

          let uuid = require('uuid');
          let client_token = uuid.v4();
          let server_token = uuid.v4();

          websites.add(name, client_token, server_token);
          res.render(resultTemplate, {
            title: 'Get your token',
            client_token: client_token,
            server_token: server_token
          });
        }
        else {
            res.render('yard/websites/result', {title: 'Error', error: "Website already connected"});
        }
    });

});


module.exports = router;
