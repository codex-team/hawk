let request = require('request');
let Twig = require('twig');
let email = require('../modules/email');

module.exports = function () {

  const templatesPath = 'views/notifies/';
  const templates = {
    messenger: 'messenger.twig',
    email: 'email.twig'
  };

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
  let send = function (user, domain, event) {

    Twig.renderFile(templatesPath + templates.messenger, {event: event, domain: domain}, function (err, html) {

      if (err) {
        console.log('Can not render notify template because of ', err);
        return;
      }

      if (user.notifies.tg && user.tgHook) {
        request.post({url: user.tgHook, form: {message: html, parse_mode: 'HTML'}})
      }
      if (user.notifies.slack && user.slackHook) {
        request.post({url: user.slackHook, form: {message: html, parse_mode: 'HTML'}})
      }

    });

    if (user.notifies.email) {

      Twig.renderFile(templatesPath + templates.email, {event: event, domain: domain}, function (err, html) {
        email.init();
        email.send(
          user.email,
          'Error on ' + domain,
          '',
          html
        );
      })
    }


  };

  return {
    send: send
  }

}();