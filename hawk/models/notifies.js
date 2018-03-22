let request = require('request');
let Twig = require('twig');
let email = require('../modules/email');
let mongo = require('../modules/database');
let collections = require('../config/collections');
let Crypto = require('crypto');
let projectModel = require('./project');

/** Notifications config **/
let config = require('../config/notifications');

module.exports = function () {
  const templatesPath = 'views/notifies/';
  const templates = {
    messenger: 'messenger.twig',
    email: 'email/notify.twig'
  };

  let timers = {};
  /* Time to wait before send notification about repeated events */
  const GROUP_TIME = config.GROUP_TIME;

  /**
   * Send notifications about new event using user settings
   *
   * Available services
   * - Telegram
   * - Slack
   * - Email
   *
   * @param project
   * @param event
   * @param times
   */
  let send_ = function (project, event, times) {
    if (!times) {
      return;
    }

    let users = [];

    return projectModel.getTeam(project._id)
      .then(function (team) {
        let queries = [];

        team.forEach(function (member) {
          let query = projectModel.getUserData(project._id, member.id)
            .then(function (userData) {
              userData.email = member.email;
              users.push(userData);
            });

          queries.push(query);
        });

        return Promise.all(queries);
      })
      .then(function () {
        users.forEach(function (userData) {
          let userId = userData.userId.toString(),
            renderParams = {
              event: event,
              project: project,
              serverUrl: process.env.SERVER_URL,
              times: times,
              userData: userData,
              unsubscribeHash: generateUnsubscribeHash(userId, project._id)
            };


          Twig.renderFile(templatesPath + templates.messenger, renderParams, function (err, html) {
            if (err) {
              logger.error('Can not render notify template because of ', err);
              return;
            }

            /**
             * Send Telegram notification
             */
            if (userData.notifies.tg && userData.tgHook) {
              request.post({
                url: userData.tgHook,
                form: {
                  message: html,
                  parse_mode: 'HTML'
                }
              }, (err, httpResponse, body) => {
                if (err) {
                  logger.error('Can not send notification to Telegram because of ', err);
                }
              });
            }

            /**
             * Send Slack notification
             */
            if (userData.notifies.slack && userData.slackHook) {
              request.post({
                url: userData.slackHook,
                form: {
                  message: html,
                  parse_mode: 'HTML'
                }
              }, (err, httpResponse, body) => {
                if (err) {
                  logger.error('Can not send notification to Slack because of ', err);
                }
              });
            }

            /**
             * Send email notification
             */
            if (userData.notifies.email) {
              Twig.renderFile(templatesPath + templates.email, renderParams, function (err, html) {
                if (err) {
                  logger.error('Can not render notify template because of ', err);
                  return;
                }

                let emailSubject = ' on ' + project.name + ': «' + event.message + '»';

                if (times > 1) {
                  emailSubject = times + ' errors' + emailSubject;
                } else {
                  emailSubject = 'Error' + emailSubject;
                }

                email.send(
                  userData.email,
                  emailSubject,
                  '',
                  html
                );
              });
            }
          });
        });
      });
  }

  /**
   * Set new Timeout for event and send notification about first event.
   * If there are no more new events in timeout was set, notification will send by private send_ method
   * Otherwise, if new events are coming, Timeout will be restart
   *
   * @param project
   * @param event
   */
  let send = function (project, event) {
    /** getting a pack for this error with errors number */
    let timer = timers[event.groupHash];

    /** flag */
    let notFirstError = true;

    /** check if pack of same errors exists */
    if (timer) {
      /** increase number of errors */
      timer.times++;
      /** clear timeout for sending this pack */
      clearTimeout(timer.timeout);
    } else {
      /** notify about first event */
      send_(project, event, 1)
        .catch(function (e) {
          logger.error('Error while sending notification ', e);
        });
      notFirstError = false;

      /** create a new error pack with 0 errors */
      timer = timers[event.groupHash] = {
        times: 0
      };
    }

    /** Remove timer if no error in GROUP_TIME seconds */
    timer.timeout = setTimeout(function () {
      if (notFirstError) {
        /** notify about pack of errors */
        send_(project, event, timer.times)
          .catch(function (e) {
            logger.error('Error while sending notification ', e);
          });
      }

      /**
       * If you want to notify user when this
       * error happens again firstly in a big
       * avalanche then REMOVE this error's pack.
       * It would be better for your server's RAM.
       */
      delete timers[event.groupHash];
    }, GROUP_TIME);
  };

  /**
   * Generate unsubscribe hash from user id
   *
   * @param userId
   * @param projectId
   * @returns {String} generated hash
   */
  let generateUnsubscribeHash = function (userId, projectId) {
    let string = userId + process.env.SALT + projectId;

    let hash = Crypto.createHash('sha256').update(string, 'utf8').digest('hex');

    return hash;
  };

  /**
   * Set notifies.email flag in user profile to false
   *
   * @param userId
   * @param projectId
   * @param type
   */
  let unsubscribe = function (userId, projectId, type='email') {
    let field = 'notifies.' + type,
        collection = collections.MEMBERSHIP + ':' + userId;

    return mongo.updateOne(
      collection,
      {project_id: mongo.ObjectId(projectId)},
      {$set: {[field]: false}}
    );
  };

  return {
    send: send,
    unsubscribe: unsubscribe,
    generateUnsubscribeHash: generateUnsubscribeHash
  };
}();
