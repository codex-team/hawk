'use strict';
let config = require('../config/email');
let nodemailer = require("nodemailer");

module.exports = function () {

  let transporter;

  /* Init transporter with date from config */
  let init = function () {

    if (!config.email.auth.user) {
      console.log('Email config: user is missed');
      return;
    }

    transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: true, // secure:true for port 465, secure:false for port 587
      auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass
      }
    });

  };

  /**
  * Send email to specified receiver with subject and text
  *
  * from    - {name:'Hawk.io Team', email:'team@hawk.so'}
  * to      - 'receiver@mail.com'
  * subject
  * text
  * html
  */
  let send = function (to, subject, text, html) {

    if (!config.email.auth.user) {
      console.log('Email config: user is missed');
      return;
    }

    if (!config.email.hawk.name) {
      console.log('Email config: sender is missed');
      return;
    }

    let mailOptions = {
      from: '"'+ config.email.hawk.name +'" <'+ config.email.hawk.email + '>', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
    });

  };

  return {
    init : init,
    send : send
  }

}();
