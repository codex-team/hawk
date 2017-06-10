'use strict';
var config = require('../config/email');
var nodemailer = require("nodemailer");

var email = (function () {

  var transporter;

  /* Init transporter with date from config */
  var init = function () {

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

  /* Send email to specified receiver with subject and text */
  var send = function (from, to, subject, text, html) {

    if (!config.email.auth.user) {
      console.log('Email config: user is missed');
      return;
    }

    let mailOptions = {
        from: '"'+ from.name +'" <'+ from.email + '>', // sender address
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

})();

module.exports = email;
