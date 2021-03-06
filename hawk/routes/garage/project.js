let express = require('express');
let router = express.Router();
let uuid = require('uuid');
let Twig = require('twig');
let email = require('../../modules/email');
let project = require('../../models/project');
let user = require('../../models/user');
let translit = require('../../modules/translit');
let collections = require('../../config/collections');
let mongo = require('../../modules/database');

/**
 * POST /project/add handler
 * Save project data to the database
 *
 * @param req
 * @param res
 */
let add = function (req, res, next) {
  try {
    let post = req.body,
      token = uuid.v4();

    if (!post.name || !post.name.trim()) {
      let message = 'Please, pass project name';

      res.redirect('/garage/settings?success=0&message=' + message);
      return;
    }

    let data = {
      user: res.locals.user,
      name: post.name,
      description: post.description,
      domain: post.domain,
      dt_added: new Date(),
      uid_added: res.locals.user._id,
      token: token,
      logo: '',
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
            global.catchException(err);
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
  } catch (e) {
    next(e)
  }
};

/**
 * POST /project/inviteMember handler
 *
 * Add member to the project
 *
 * @param req
 * @param res
 */
let inviteMember = async function (req, res, next) {
  let userEmail = req.body.email,
      projectId = req.body.projectId;

  if (!userEmail) {
    res.json({
      success: 0,
      message: 'Please, pass user email'
    });
  }

  try {
    let foundProject = await project.get(projectId);

    /**
     * Check if user already in team
     */
    let foundUser = await user.getByParams({email: userEmail});

    if (foundUser) {
      let isMember = await project.checkMembershipByUserId(foundUser._id, foundProject._id);

      if (isMember) {
        throw Error('User is already in team');
      }
    }

    /**
     * Check if user was invited
     */
    let isInvited = await project.checkMembershipByEmail(userEmail, foundProject._id);

    if (isInvited) {
      throw Error('Invitation is already sent');
    }

    let newMemberRequest = await project.addMember(foundProject._id, null, null, userEmail);

    let inviteHash = project.generateInviteHash(newMemberRequest.insertedId, foundProject._id);

    let inviteLink = process.env.SERVER_URL + '/invite'
      + '?member=' + newMemberRequest.insertedId
      + '&project=' + foundProject._id
      + '&hash=' + inviteHash;

    let renderParams = {
      project: foundProject,
      inviteLink: inviteLink
    };

    Twig.renderFile('views/notifies/email/projectInvite.twig', renderParams, (err, html) => {
      if (err) {
        logger.error('Error while rendering email template %o' % err);
        global.catchException(err);
        return;
      }

      email.send(userEmail, 'Invitation to ' + foundProject.name, '', html);
    });

    res.json({
      success: 1,
      message: 'Invitation for ' + userEmail + ' was sent'
    });
  } catch (e) {
    logger.error('Error while sending project invitation ', e);
    global.catchException(e);
    res.json({
      success: 0,
      message: e.message
    });
  }
};

/**
 * POST project/editNotifies handler
 * Save user notifications preferences
 *
 * @param req
 * @param res
 */
let editNotifies = function (req, res, next) {
  try {
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
        global.catchException(e);
        res.json({
          success: 0,
          message: 'Can\'t save notification preferences because of server error'
        });
      });
  } catch (e) {
    next(e)
  }
};

/**
 * POST /project/saveWebhook handler
 * Save user notifications webhook
 *
 * @param req
 * @param res
 */
let saveWebhook = function (req, res, next) {
  try {
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
        global.catchException(e);
        res.json({
          success: 0,
          message: 'Can\'t save webhook because of server error'
        });
      });
  } catch (e) {
    next(e)
  }
};

/**
 * POST /project/grantAdminAccess handler
 *
 * Gran admin access to user
 *
 * @param req
 * @param res
 */
let granAdminAccess = function (req, res, next) {
  try {
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
        global.catchException(e);
        res.json({
          success: 0,
          message: 'Can\'t grant access because of server error'
        });
      });
  } catch (e) {
    next(e)
  }
};

router.post('/project/add', add);
router.post('/project/inviteMember', inviteMember);
router.post('/project/editNotifies', editNotifies);
router.post('/project/saveWebhook', saveWebhook);
router.post('/project/grantAdminAccess', granAdminAccess);

module.exports = router;
