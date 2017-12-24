let express = require('express');
let router = express.Router();
let uuid = require('uuid');
let Twig = require('twig');
let email = require('../../modules/email');
let project = require('../../models/project');
let user = require('../../models/user');
let translit = require('../../modules/translit');

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

  if (!post.name || !post.name.trim()) {
    let message = 'Please, pass project name';

    res.redirect('/garage/settings?success=0&message=' + message);
    return;
  }

  /** @const {String} */
  let coverIconPath = process.env.SERVER_URL + '/static/svg/project-icon-cover.svg';

  let data = {
    name: post.name,
    description: post.description,
    domain: post.domain,
    dt_added: new Date(),
    uid_added: res.locals.user._id,
    token: token,
    logo: coverIconPath,
    uri: translit(post.name, true)
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

      res.redirect('/garage/settings?success=1&message=' + message);
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
    projectId = req.body.projectId;

  if (!userEmail) {
    res.json({
      success: 0,
      message: 'Please, pass user email'
    });
  }

  user.getByParams({email: userEmail})
    .then(function (foundUser) {

      if (!foundUser) {
        throw Error('User not found');
      }

      return project.get(projectId)
        .then(function (foundProject) {
          return {foundProject, foundUser};
        });
    })
    .then(function ({foundProject, foundUser}) {
      return project.addMember(foundProject._id, foundProject.uri, foundUser._id)
        .then(function () {
          return {foundProject, foundUser};
        });
    })
    .then(function ({foundProject, foundUser}) {
      let inviteHash = project.generateInviteHash(foundUser._id, foundProject._id),
        inviteLink = process.env.SERVER_URL + '/invite?user=' + foundUser._id
          + '&project=' + foundProject._id
          + '&hash=' + inviteHash,
        renderParams = {
          project: foundProject,
          inviteLink: inviteLink
        };

      Twig.renderFile('views/notifies/email/projectInvite.twig', renderParams, function (err, html) {
        if (err) {
          logger.error('Error while rendering email template %o' % err);
          return;
        }

        email.send(userEmail, 'Invitation to ' + foundProject.name, '', html);
      });
    })
    .then(function () {
      res.json({
        success: 1,
        message: 'Invitation for ' + userEmail + ' was sent'
      });
    })
    .catch(function (e) {
      logger.error('Error while sending project invitation ', e);
      res.json({
        success: 0,
        message: e.message
      });
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
      res.json({
        success: 1,
        message: 'Preferences was saved'
      });
    })
    .catch(function (e) {
      logger.error('Error while saving notification preferences ', e);
      res.json({
        success: 0,
        message: 'Can\'t save notification preferences because of server error'
      });
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
      res.json({
        success: 1,
        message: 'Webhook was saved'
      });
    })
    .catch(function (e) {
      logger.error('Error while saving notifications webhook ', e);
      res.json({
        success: 0,
        message: 'Can\'t save webhook because of server error'
      });
    });
};

/**
 * POST /project/grantAdminAccess handler
 *
 * Gran admin access to user
 *
 * @param req
 * @param res
 */
let granAdminAccess = function (req, res) {
  let post = req.body;

  project.grantAdminAccess(post.projectId, post.userId)
    .then(function () {
      res.json({
        success: 1,
        message: 'Access granted'
      });
    })
    .catch(function (e) {
      logger.error('Error while granting admin access ', e);
      res.json({
        success: 0,
        message: 'Can\'t grant access because of server error'
      });
    });
};

router.post('/project/add', add);
router.post('/project/inviteMember', inviteMember);
router.post('/project/editNotifies', editNotifies);
router.post('/project/saveWebhook', saveWebhook);
router.post('/project/grantAdminAccess', granAdminAccess);

module.exports = router;