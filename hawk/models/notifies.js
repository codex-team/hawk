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

    let renderParams = {
      event: event,
      domain: domain,
      serverUrl: process.env.SERVER_URL,
      unsubscribeToken: user.unsubscribe_token
    };

    Twig.renderFile(templatesPath + templates.messenger, renderParams, function (err, html) {

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

      Twig.renderFile(templatesPath + templates.email, renderParams, function (err, html) {

        if (err) {

          console.log('Can not render notify template because of ', err);
          return;

        }

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
