let request = require('request');
let Twig = require('twig');
let email = require('../modules/email');

module.exports = function () {

  let send = function (user, domain, event) {


    Twig.renderFile('views/notifies/messenger.twig', {event: event, domain: domain}, function (err, html) {

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

      Twig.renderFile('views/notifies/email.twig', {event: event, domain: domain}, function (err, html) {
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