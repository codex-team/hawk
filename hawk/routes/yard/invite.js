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

  let foundProject;

  project.get(get.project)
    .then(project => {
      foundProject = project
    })
    .then(() => {
      return project.confirmInvitation(foundProject._id, get.member, user)
    })
    .then(() => {
      return modelProject.addProjectToUserProjects(user._id, foundProject);
    })
    .then(() => {
      res.render('yard/invite', {
        user: user,
        project: foundProject
      });
    })
    .catch(e => {
      logger.error('Error while confirm project invitation ', e);
      res.render('yard/errors/error.twig', {
        title: 'Something went wrong',
        message: e
      });
    });
};

router.get('/', confirmInvite);

module.exports = router;
