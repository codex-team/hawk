let express = require('express');
let router = express.Router();
let user = require('../../models/user');
let csrf = require('../../modules/csrf');

let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();

let uploader = require('../../modules/upload');
let project = require('../../models/project');

/**
 * Check image valid
 * Upload icon to capella and change icon path in database
 *
 * @param req
 * @param res
 */

let uploadIcon = function (req, res) {
    let availableExtensions= ['image/png', 'image/jpeg'];

    let file = req.files['file-'+req.query.id];

    if(!availableExtensions.includes(file.type))
    {
      let message = 'Invalid icon format. Please, use jpg or png';

      res.redirect('/garage/settings?success=0&message=' + message)
      return;
    }

    //max bytes image size (15MB)
    let maxSize = 15 * 8 * 1024 * 1024;
    if(file.size > maxSize)
    {
      let message = 'Image too big. Max size is 15MB';

      res.redirect('/garage/settings?success=0&message=' + message)
      return;
    }

    uploader.uploadImage(file.path, function (err, resp, body)
    {
      let json = JSON.parse(body);
      let logoUrl =  json.url;
      project.setIcon(req.query.id,logoUrl).then(function (resolve) {
        res.redirect('/garage/settings');
      });
  });
};

/**
 * Garage settings page
 *
 * @param req
 * @param res
 */
let index = function (req, res) {
  let params = {
    user: res.locals.user,
    csrfToken: req.csrfToken(),
    meta : {
      title : 'User settings'
    },
    success: req.query.success,
    message: req.query.message,
    projects: res.locals.userProjects
  };

  res.render('garage/settings', params);
};

/**
 * Settings update handler
 *
 * @param req
 * @param res
 */
let update = function (req, res) {
  let post = req.body;

  try {
    let params = {
      email: post.email,
    };

    if (post.password) {
      if (post.password !== post.repeatedPassword) {
        throw Error('Passwords don\'t match');
      }
      params.password = post.password;
    }

    if (!params.email) {
      throw Error('Email should be passed');
    }

    user.update(res.locals.user, params)
      .then(function () {
        let message = 'Saved 😉';

        res.redirect('/garage/settings?success=1&message=' + message);
      });
  } catch (e) {
    res.redirect('/garage/settings?success=0&message='+e.message);
  }
};

router.get('/settings', csrf, index);
router.post('/settings/save', csrf, update);
router.post('/settings/set_icon',multipartMiddleware, uploadIcon);

module.exports = router;
