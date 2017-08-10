'use strict';

let express = require('express');
let router = express.Router();
let events = require('../../models/events');
let collections = require('../../config/collections');

/**
 * Garage events lists (route /garage/<project>/<tag>)
 *
 * @param req
 * @param res
 */
let index = function (req, res) {
  let currentProject,
      currentTag;

  let params = req.params,
      allowedTags = ['fatal', 'warnings', 'notice', 'javascript'];

  currentProject = params.project;
  currentTag = params.tag;

  /** Check if use tag w\o project */
  if (!currentTag && allowedTags.includes(currentProject)) {
    currentTag = currentProject;
    currentProject = null;
  }

  if (currentTag && !allowedTags.includes(currentTag)) {
    res.sendStatus(404);
    return;
  }

  if (currentProject) {
    res.locals.userProjects.forEach(function (project) {
      if (project.user.projectUri === currentProject) {
        currentProject = project;
      }
    });

    if (!currentProject.name) {
      res.sendStatus(404);
      return;
    }
  }

  let findParams = {};

  if (currentTag) {
    findParams.tag = currentTag;
  }

  Promise.resolve().then(function () {
    if (currentProject) {
      return events.get(currentProject.id, findParams, true);
    } else {
      return events.getAll(res.locals.user, findParams);
    }
  })
    .then(function (foundEvents) {
      res.render('garage/index', {
        user: res.locals.user,
        userProjects: res.locals.userProjects,
        currentProject: currentProject,
        currentTag: currentTag,
        events: foundEvents,
        meta : {
          title : 'Garage'
        }
      });
    })
    .catch (function (e) {
      logger.error('Error while getting user data for main garage page: ', e);
    });
};

router.get('/:project?/:tag?', index);

module.exports = router;
