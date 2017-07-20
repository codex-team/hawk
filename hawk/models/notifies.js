let request = require('request');
let Twig = require('twig');
let email = require('../modules/email');
let mongo = require('../modules/database');
let collections = require('../config/collections');
let Crypto = require('crypto');

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
   * @param user
   * @param domain
   * @param event
   * @param times
   */
  let send_ =function (user, domain, event, times) {
    if (!times) {
      return;
    }

    let userId = user._id.toString();

    let renderParams = {
      event: event,
      domain: domain,
      serverUrl: process.env.SERVER_URL,
      times: times,
      userId: userId,
      userIdHash: generateUnsubscribeHash(userId)
    };


    Twig.renderFile(templatesPath + templates.messenger, renderParams, function (err, html) {
      if (err) {
        logger.error('Can not render notify template because of ', err);
        return;
      }

      if (user.notifies.tg && user.tgHook) {
        request.post({url: user.tgHook, form: {message: html, parse_mode: 'HTML'}});
      }

      if (user.notifies.slack && user.slackHook) {
        request.post({url: user.slackHook, form: {message: html, parse_mode: 'HTML'}});
      }
    });

    if (user.notifies.email) {
      Twig.renderFile(templatesPath + templates.email, renderParams, function (err, html) {
        if (err) {
          logger.error('Can not render notify template because of ', err);
          return;
        }

        let emailSubject = ' on ' + domain + ': «' + event.message + '»';

        if (times > 1) {
          emailSubject = times + ' errors' + emailSubject;
        } else {
          emailSubject = 'Error' + emailSubject;
        }

        email.init();
        email.send(
          user.email,
          emailSubject,
          '',
          html
        );
      });
    }
  };

  /**
   * Set new Timeout for event and send notification about first event.
   * If there are no more new events in timeout was set, notification will send by private send_ method
   * Otherwise, if new events are coming, Timeout will be restart
   *
   * @param user
   * @param domain
   * @param event
   */
  let send = function (user, domain, event) {
    let timer = timers[event.groupHash];

    /* Check if this event has come few time ago */
    if (timer) {
      clearTimeout(timer.timeout);
    } else {
      send_(user, domain, event, 1);

      timers[event.groupHash] = {
        times: 0
      };

      timer = timers[event.groupHash];
    }

    timer.timeout = setTimeout(send_, GROUP_TIME, user, domain, event, timer.times);
    timer.times++;
  };

  /**
   * Generate unsubscribe hash from user id
   *
   * @param userId
   * @returns {String} generated hash
   */
  let generateUnsubscribeHash = function (userId) {
    userId = userId + process.env.SALT;

    let hash = Crypto.createHash('sha256').update(userId, 'utf8').digest('hex');

    return hash;
  };

  /**
   * Set notifies.email flag in user profile to false
   *
   * @param userId
   */
  let unsubscribe = function (userId) {
    return mongo.updateOne(
      collections.USERS,
      {_id: mongo.ObjectId(userId)},
      {$set: {'notifies.email': false}}
    );
  };

  return {
    send: send,
    unsubscribe: unsubscribe,
    generateUnsubscribeHash: generateUnsubscribeHash
  };
}();
