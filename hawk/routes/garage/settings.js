let express = require('express');
let router = express.Router();
let user = require('../../models/user');
const archiver = require('../../modules/archiver');

/**
 * CSRF protection middlewares
 * @type {module:csrf}
 */
let csrf = require('../../modules/csrf');

let uploader = require('../../modules/upload');
let project = require('../../models/project');

/**
 * Middleware for parsing form data, including multipart/form-data file upload.
 * {@link https://github.com/utatti/express-formidable}
 */
let formidable = require('express-formidable');
let multipartMiddleware = formidable();

/**
 * File system
 * {@link https://nodejs.org/api/fs.html}
 */
const fs = require('fs');

/**
 * Upload Project Logo to the Capella and save an URL
 *
 * @param req
 * @param res
 */
let uploadLogo = function (req, res, next) {
  try {
    let file = req.files['file'];

    if (!checkImageValid(file, res)) {
      return;
    }

    uploader.uploadImageToCapella(file.path, (resp) => {

      /**
       * Remove temporary file
       */
      fs.unlink(file.path);

      if (!resp.success) {
        global.catchException('Error while uploading logo image', resp);
        res.send({
          status: 400,
          message: 'Error. Please, try again or later'
        });
        return;
      }

      let logoUrl = resp.url;

      project.setIcon(req.fields.projectId, logoUrl)
        .then(function () {
          res.send({
            status: 200,
            logoUrl: logoUrl
          });
        })
        .catch(error => {
          global.catchException(error)
        });
    });
  } catch (e) {
    next(e)
  }
};

/**
 * Check image valid
 *
 * @param {JSON} file
 * @param res
 * @returns {boolean}
 */
let checkImageValid = function (file, res) {
  let availableExtensions = ['image/png', 'image/jpeg', 'image/jpg'];

  if (!availableExtensions.includes(file.type)) {
    let message = 'This file extension is not supported. Please, use jpg or png instead';

    res.send({
      status: 500,
      message: message
    });
    return false;
  }

  // max bytes image size (15MB)
  let maxSize = 15 * 1024 * 1024;

  if (file.size > maxSize) {
    let message = 'File is too big. Please try another one under 15MB';

    res.send({
      status: 500,
      message: message
    });
    return false;
  }
  return true;
};

/**
 * Garage settings page
 *
 * @param req
 * @param res
 */
let index = function (req, res, next) {
  try {
    let params = {
      user: res.locals.user,
      csrfToken: req.csrfToken(),
      meta: {
        title: 'User settings'
      },
      success: req.query.success,
      message: req.query.message,
      projects: res.locals.userProjects,
      eventsLimit: archiver.eventsLimit
    };

    res.render('garage/settings', params);
  } catch (e) {
    next(e)
  }
};

/**
 * Settings update handler
 *
 * @param req
 * @param res
 */
let update = function (req, res, next) {
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
      })
      .catch(error => {
        next(e)
      });
  } catch (e) {
    global.catchException(e);
    res.redirect('/garage/settings?success=0&message=' + e.message);
  }
};

router.get('/settings', csrf.byCookie, index);
router.post('/settings/save', csrf.byCookie, update);
router.post('/settings/loadIcon', multipartMiddleware, csrf.byAjaxForm, uploadLogo);

module.exports = router;
