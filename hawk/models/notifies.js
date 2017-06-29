let request = require('request');
let Twig = require('twig');
let email = require('../modules/email');

module.exports = function () {

  const templatesPath = 'views/notifies/';
  const templates = {
    messenger: 'messenger.twig',
    email: 'email.twig'
  };

  let timers = {};
  const WAIT_TIME = 10 * 1000; // 30 seconds

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
   */
  let send_ =function (user, domain, event, times) {

    let renderParams = {
      event: event,
      domain: domain,
      hostName: process.env.HOST_NAME,
      times: times
    };


    Twig.renderFile(templatesPath + templates.messenger, renderParams, function (err, html) {

      if (err) {

        logger.log('error', 'Can not render notify template because of ', err);
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

          logger.log('error', 'Can not render notify template because of ', err);
          return;

        }

        email.init();
        email.send(
          user.email,
          'Error on ' + domain,
          '',
          html
        );

      });

    }

  };


  let send = function (user, domain, event) {


    let timer = timers[event.groupHash];

    if (timer) {

      clearTimeout(timer.timeout);

    } else {

      timers[event.groupHash] = {
        times: 0
      };

      timer = timers[event.groupHash];

    }

    timer.times++;
    timer.timeout = setTimeout(send_, WAIT_TIME, user, domain, event, timer.times);

  };

  return {
    send: send
  };

}();
