let express = require('express');
let router = express.Router();
let uuid = require('uuid');
let translit = require('translit-rus-eng');
let Twig = require('twig');
let email  = require('../../modules/email');
let project = require('../../models/project');
let user = require('../../models/user');

/**
 * POST /project/add handler
 * Save project data to the database
 *
 * @param req
 * @param res
 */
let add = function (req, res) {
  let post = req.body,
      token = uuid.v4();

  let data = {
    name: post.name,
    description: post.description,
    domain: post.domain,
    dt_added: new Date(),
    uid_added: res.locals.user._id,
    token: token,
    uri: translit(post.name, 'slug')
  };

  project.add(data)
    .then(function (insertedProject) {
      let renderParams = {
        name: insertedProject.name,
        token: insertedProject.token,
        serverUrl: process.env.SERVER_URL
      };

      Twig.renderFile('views/notifies/email/project.twig', renderParams, function (err, html) {
        if (err) {
          logger.error('Can not render notify template because of ', err);
          return;
        }

        email.send(
          res.locals.user.email,
          'Integration token for ' + insertedProject.name,
          '',
          html
        );
      });

      let message = insertedProject.name + ' was successfully added';

      res.redirect('/garage/settings?success=1&message='+message);
    });
};

/**
 * POST /project/inviteMember handler
 *
 * Add member to the project
 *
 * @param req
 * @param res
 */
let inviteMember = function (req, res) {
  let userEmail = req.body.email,
      projectId = req.body.projectId,
      foundUser;

  if (!userEmail || !projectId) {
    res.sendStatus(400);
    return;
  }

  user.getByParams({email: userEmail})
    .then(function (foundUser_) {
      foundUser = foundUser_;

      if (!foundUser) {
        throw Error('User not found');
      }

      return project.get(projectId);
    })
    .then(function (foundProject) {
      return project.addMember(foundProject._id, foundProject.uri, foundUser._id);
    })
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (e) {
      console.log(e);
      res.sendStatus(400);
    });
};

/**
 * POST project/editNotifies handler
 * Save user notifications preferences
 *
 * @param req
 * @param res
 */
let editNotifies = function (req, res) {
  let post = req.body;

  project.editNotifies(post.projectId, post.userId, post.type, post.value)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (e) {
      console.log(e);
      res.sendStatus(400);
    });
};

/**
 * POST /project/saveWebhook handler
 * Save user notifications webhook
 *
 * @param req
 * @param res
 */
let saveWebhook = function (req, res) {
  let post = req.body;

  project.saveWebhook(post.projectId, post.userId, post.type, post.value)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (e) {
      console.log(e);
      res.sendStatus(400);
    });
};


router.post('/project/add', add);
router.post('/project/inviteMember', inviteMember);
router.post('/project/editNotifies', editNotifies);
router.post('/project/saveWebhook', saveWebhook);

module.exports = router;