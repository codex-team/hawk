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
      send_(user, domain, event, 1);
      notFirstError = false;

      /** create a new error pack with 0 errors */
      timer = timers[event.groupHash] = {
        times: 0
      };
    }

    /** ready to send. if this error is not first need to set timeout */
    if (notFirstError) {
      timer.timeout = setTimeout(function () {
        /** notify about pack of errors */
        send_(user, domain, event, timer.times);

        /**
         * If you don't want to notify about
         * first error this type never ever
         * then just RESET counter.
         */
        // timer = timers[event.groupHash] = {
        //   times: 0
        // };

        /**
         * If you want to notify user when this
         * error happens again firstly in a big
         * avalanche then REMOVE this error's pack.
         * It would be better for your server's RAM.
         */
        delete timers[event.groupHash];
      }, GROUP_TIME);
    };
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
   * @param type
   */
  let unsubscribe = function (userId, type='email') {
    let field = 'notifies.' + type;

    return mongo.updateOne(
      collections.USERS,
      {_id: mongo.ObjectId(userId)},
      {$set: {[field]: false}}
    );
  };

  return {
    send: send,
    unsubscribe: unsubscribe,
    generateUnsubscribeHash: generateUnsubscribeHash
  };
}();
