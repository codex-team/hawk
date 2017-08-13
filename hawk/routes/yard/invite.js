let express = require('express');
let router = express.Router();
let project = require('../../models/project');


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

  let generatedHash = project.generateInviteHash(get.user, get.project);

  if (generatedHash !== get.hash) {
    res.render('yard/errors/error.twig', {
      title: 'Invalid link',
      message: 'Sorry, this link doesn\'t work. Request new from team leader'
    });
    return;
  }

  project.confirmInvitation(get.project, get.user)
    .then(function (foundProject) {
      res.render('yard/invite', {
        user: res.locals.user,
        project: foundProject
      });
    })
    .catch(function (e) {
      logger.error('Error while confirm project invitation ', e);
      res.sendStatus(500);
    });
};

router.get('/', confirmInvite);

module.exports = router;