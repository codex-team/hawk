'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var winston = require('winston');
var morgan = require('morgan');
var fs = require('fs');

/** Setup loggers **/

var logsDir = './logs',
  accessDir = logsDir + '/access',
  errorsDir = logsDir + '/errors';

if (!fs.existsSync(logsDir)) {

  fs.mkdirSync(logsDir);
  fs.mkdirSync(accessDir);
  fs.mkdirSync(errorsDir);

}
if (!fs.existsSync(accessDir)) {

  fs.mkdirSync(accessDir);

}
if (!fs.existsSync(errorsDir)) {

  fs.mkdirSync(errorsDir);

}

require('winston-daily-rotate-file');
winston.loggers.add('access', {
  dailyRotateFile: {
    level: 'debug',
    filename: 'logs/access/.log',
    datePattern: 'yyyy-MM',
    prepend: true,
    timestamp: true
  }
});

winston.loggers.add('console', {
  console: {
    level: 'debug',
    colorize: true,
    timestamp: true,
    handleExceptions: true,
    humanReadableUnhandledException: true
  },
  dailyRotateFile: {
    level: 'debug',
    filename: 'logs/errors/.log',
    datePattern: 'yyyy-MM',
    prepend: true,
    timestamp: true,
    handleExceptions: true,
    humanReadableUnhandledException: true
  }
});

global.logger = winston.loggers.get('console');
let accessLogger = winston.loggers.get('access');

accessLogger.stream = {

  write: function (message) {

    accessLogger.info(message);

  }

};

require('dotenv').config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/** We use morgan as express middleware to link winston and express **/
app.use(morgan('combined', { stream: accessLogger.stream }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));

/**
 * Garage
 */
var garage = require('./routes/garage/garage');

app.use('/garage', garage);

/**
 * Yard
 */
var index = require('./routes/yard/index');
var login = require('./routes/yard/auth/login');
var logout = require('./routes/yard/auth/logout');
var join = require('./routes/yard/auth/join');
var websites = require('./routes/yard/websites');

app.use('/', index);
app.use('/websites', websites);
app.use('/login', login);
app.use('/logout', logout);
app.use('/join', join);



/**
 * Catcher
 */
var catcher = require('./routes/catcher/catcher');

app.use('/catcher', catcher);



// catch 404 and forward to error handler
app.use(function (req, res, next) {

  var err = new Error('Not Found');

  err.status = 404;
  next(err);

});

// error handler
app.use(function (err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.ENVIRONMENT === 'DEVELOPMENT' ? err : {};

  // render the error page
  res.status(err.status || 500);

  let errorPageData;

  if (err.status === 404) {

    errorPageData = {
      title: '404',
      message : 'Page not found'
    };

  } else {

    errorPageData = {
      title: ':(',
      message : 'Sorry, dude. Looks like some of our services is busy.'
    };

  }

  res.render('yard/errors/error', errorPageData);

});


module.exports = app;
