let express = require('express');
let router = express.Router();
let project = require('../../models/project');
let modelProject = require('../../models/project');

/**
 * GET /project/invite handler
 *
 * Confirm user participation in project
 *
 * @param req
 * @param res
 */
let confirmInvite = function (req, res) {
  let get = req.query;

  let generatedHash = project.generateInviteHash(get.member, get.project);

  if (generatedHash !== get.hash) {
    res.render('yard/errors/error.twig', {
      title: 'Invalid link',
      message: 'Sorry, this link doesn\'t work. Request a new one from your team leader'
    });
    return;
  }

  let user = res.locals.user;

  if (!user) {
    res.cookie('redirect', req.originalUrl);
    res.redirect('/join');
    return;
  }

  let foundProject, redirect;

  project.get(get.project)
    .then(project => {
      foundProject = project
    })
    .then(() => {
      return project.confirmInvitation(foundProject._id, get.member, user._id)
    })
    .catch(e => {
      logger.info('Invitation was not confirmed:', e);
      redirect = '/garage';

      throw Error(e);
    })
    .then(() => {
      return modelProject.addProjectToUserProjects(user._id, get.project);
    })
    .then(() => {
      res.render('yard/invite', {
        user: user,
        project: foundProject
      });
    })
    .catch(e => {
      if (redirect) {
        res.redirect(redirect);
      } else {
        logger.error('Error while confirm project invitation ', e);
        res.sendStatus(500);
      }
    });
};

router.get('/', confirmInvite);

module.exports = router;
