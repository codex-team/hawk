'use strict';

const express = require('express');
const router = express.Router();
const events = require('../../models/events');
const archiver = require('../../modules/archiver');

/**
 * limit count of events per page
 */
const EVENT_LIMIT = 8;

/**
 * Garage events lists (route /garage/<project>/<tag>?page=<page>)
 *
 * @param req
 * @param res
 */
let index = function (req, res, next) {
  try {
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

    /** pagination settings */
    let page = req.query.page || 1,
      limit = EVENT_LIMIT,
      skip = (parseInt(page) - 1) * (limit + 1);

    Promise.resolve().then(function () {
      if (currentProject) {
        return events.get(currentProject.id, findParams, true, false, limit + 1, skip);
      } else {
        return [];
      }
    })
      .then(function (foundEvents) {
        let canLoadMore = foundEvents.length > limit;

        return makeResponse_.call({req, res}, foundEvents, currentProject, currentTag, canLoadMore);
      })
      .catch(function (e) {
        logger.error('Error while getting user data for main garage page: ', e);
        global.catchException(e);
      });
  } catch (e) {
    next(e)
  }
};

/**
 * Global response function
 *
 * @param foundEvents
 * @param currentProject
 * @param currentTag
 * @param canLoadMore
 * @private
 */
let makeResponse_ = function (foundEvents, currentProject, currentTag, canLoadMore) {
  let {req, res} = this;

  if (req.xhr && req.query.page) {
    app.render('garage/events/list', {events: foundEvents, project: currentProject}, function (err, html) {
      if (err) {
        logger.error(`Something wrong happened. Can't load more ${currentProject.name} events because of `, err);
        res.sendStatus(500);
      }

      return res.json({traceback: html, canLoadMore: canLoadMore});
    });
    return;
  }

  res.render('garage/index', {
    user: res.locals.user,
    userProjects: res.locals.userProjects,
    currentProject: currentProject,
    currentTag: currentTag,
    events: foundEvents,
    canLoadMore: canLoadMore,
    meta : {
      title : 'Garage'
    },
    eventsLimit: archiver.eventsLimit
  });
};


router.get('/:project?/:tag?', index);

module.exports = router;
