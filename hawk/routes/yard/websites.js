'use strict';

let express = require('express');
let router = express.Router();
let websites = require('../../models/websites');
let user = require('../../models/user');
let Twig = require('twig');
let email = require('../../modules/email');

/* Show page for new app registration */
router.get('/create', function (req, res, next) {
  if (!res.locals.user) {
    res.redirect('/login');
    return;
  }

  res.render('yard/websites/create');
});

/* App registration callback */
router.post('/create', function (req, res, next) {
  if (!res.locals.user) {
    res.redirect('/login');
    return;
  }

  /**
     * Register site template
     * @type {String}
     */
  let resultTemplate = 'yard/websites/result',
      domain = req.body.domain;

  if (!domain) {
    res.render('yard/websites/result', {error: 'Website domain is empty'});
    return;
  }

  /* Check if application is already exists */
  websites.checkName(domain)
    .then(function (result) {
      /* if not exists -> generate token and add to DB*/
      if (result) {
        let uuid = require('uuid');
        let token = uuid.v4();

        websites.add(domain, token, res.locals.user)
          .then(function (insertResult) {
            if (!insertResult) {
              throw new Error('Something went wrong. Try again later.');
            }

            logger.info('Register new domain: ' + domain);

            if (process.env.ENVIRONMENT == 'DEVELOPMENT') {
              console.log('Domain: ', domain);
              console.log('Token: ', token);
            } else {
              let renderParams = {
                domain: domain,
                token: token,
                serverUrl: process.env.SERVER_URL
              };

              Twig.renderFile('views/notifies/email/domain.twig', renderParams, function (err, html) {
                if (err) {
                  logger.error('Can not render notify template because of ', err);
                  return;
                }

                email.send(
                  res.locals.user.email,
                  'Integration token for ' + domain,
                  '',
                  html
                );
              });
            }

            res.redirect('/garage?success=1');
          })
          .catch(function (error) {
            let message = {
              type : 'error',
              text : error.message
            };

            res.render('yard/websites/create', { message : message } );
          });
      } else {
        res.render('yard/websites/result', {error: 'Website already connected'});
      }
    });
});


module.exports = router;
