'use strict';

let express = require('express');
let router = express.Router();
let auth = require('../../../modules/auth');
let user = require('../../../models/user');


let unsubscribe = {

  /* Show join form */
  get: function (req, res, next) {

    let token = req.param('token');

    let params = {
        'unsubscribe': token
    };

    user.getByParams(params)
      .then(function(result){
          if (result) {
              user.update(result, {unsubscribe : true});
              res.redirect('/');
          } else {
              res.render('error', { message: 'Token is invalid.' });
          }
      }).catch(console.log);

  }

};

router.get('/', unsubscribe.get);

module.exports = router;