'use strict';

let express = require('express');
let router = express.Router();
let auth = require('../../../modules/auth');
let user = require('../../../models/user');


let unsubscribe = {

  /* Show join form */
  get: function (req, res, next) {

    let token = req.query.token;

    let findParams = {
          'unsubscribe_token' : token
        },
        updateParams = {
          'notifies.email' : false
        };

    user.getByParams(findParams)
      .then(function(result){
          if (result) {
              user.update(result, updateParams);
              res.redirect('/');
          } else {
              res.render('error', { message: 'Token is invalid.' });
          }
      }).catch(console.log);

  }

};

router.get('/', unsubscribe.get);

module.exports = router;