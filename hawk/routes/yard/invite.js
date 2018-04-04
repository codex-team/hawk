let express = require('express');
let router = express.Router();
let project = require('../../models/project');
let mongo = require('../../modules/database');
let collections = require('../../config/collections');

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
      message: 'Sorry, this link doesn\'t work. Request new from team leader'
    });
    return;
  }

  let user = res.locals.user;

  if (!user) {
    let params = {
      message: {
        type: 'notify',
        text: 'You must be logged in to accept an invitation'
      }
    };

    res.render('yard/auth/login', params);
    return;
  }

  let foundProject;

  project.confirmInvitation(get.project, get.member, user._id)
    .then(project => {
      foundProject = project;
    })
    .then(() => {
      console.log(user);

      let userCollection = collections.MEMBERSHIP + ':' + user._id;

      let membershipParams = {
        project_id: mongo.ObjectId(get.project),
        notifies: {
          email: true,
          tg: false,
          slack: false
        }
      };

      return mongo.insertOne(userCollection, membershipParams);
    })
    .then(() => {
      res.render('yard/invite', {
        user: user,
        project: foundProject
      });
    })
    .catch((e) => {
      logger.error('Error while confirm project invitation ', e);
      res.sendStatus(500);
    });
};

router.get('/', confirmInvite);

module.exports = router;
