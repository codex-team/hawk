var express = require('express');
var router = express.Router();
var websites = require('../models/websites');
var user = require('../models/user');

/* Show page for new app registration */
router.get('/create', function(req, res, next) {
  res.render('yard/websites/create');
});

/* App registration callback */
router.post('/create', function(req, res, next) {

    'use strict';
    user.current(req).then(function(foundUser) {
      /**
       * Register site template
       * @type {String}
       */
      let resultTemplate = 'yard/websites/result';

      if (!foundUser) {
        res.redirect("/login");
        return;
      }

      var name = req.body.domain;

      if (!name) {
        res.render('yard/websites/result', {error: 'Website domain is empty'});
        return;
      }

      /* Check if application is already exists */
      websites.checkName(name)
        .then(function (result) {
          /* if not exists -> generate token and add to DB*/
          if (result) {

            let uuid = require('uuid');
            let client_token = uuid.v4();
            let server_token = uuid.v4();

            websites.add(name, client_token, server_token, foundUser);

            res.redirect("/garage?success=1");
            // res.render(resultTemplate, {
            //   title: 'Get your token',
            //   client_token: client_token,
            //   server_token: server_token
            // });
          }
          else {
            res.render('yard/websites/result', {error: 'Website already connected'});
          }
        });
    });

});


module.exports = router;
