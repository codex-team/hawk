'use strict';

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let twigExtensions = require('./modules/twig');

require('dotenv').config();

/**
 * Set up Hawk cacher
 */
global.catchException = () => {};

if (process.env.HAWK_CATCHER_TOKEN) {
  const hawkCatcher = require('@codexteam/hawk.nodejs')({
    accessToken: process.env.HAWK_CATCHER_TOKEN
  });

  global.catchException = hawkCatcher.catchException;
}

/** * Loggers ***/
/* Main logger */
let winston = require('winston');

/* Allow rotate log files by date */
require('winston-daily-rotate-file');

/* Express middleware logger */
let morgan = require('morgan');
/** */

/* File system */
let fs = require('fs');

/** Setup loggers **/

let logsDir = './logs',
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

/* HTTP requests logger */
winston.loggers.add('access', {
  dailyRotateFile: {
    level: 'debug',
    filename: 'logs/access/.log',
    datePattern: 'yyyy-MM',
    prepend: true,
    timestamp: true
  }
});

/* Global logger */
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

/**
  * @usage logger.log(level, message)
  *        logger[level](message)
  */
global.logger = winston.loggers.get('console');

let accessLogger = winston.loggers.get('access');

accessLogger.stream = {

  write: function (message) {
    accessLogger.info(message);
  }

};


let app = express();

/**
 * User model
 * @uses  for getting current user data
 */
let user = require('./models/user');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

/**
 * Deliver favicon.ico by /favicon.ico route
 */
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

/** We use morgan as express middleware to link winston and express **/
app.use(morgan('combined', { stream: accessLogger.stream }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));

/**
* Sets response scoped variables
*
* res.locals.user        — current authored user
* res.locals.userProjects — projects list for current user
*
* @fires user.getInfo
*/
app.use(function (req, res, next) {
  res.locals.env = process.env || {};
  res.locals.user = {};
  res.locals.userProjects = {};

  user.getInfo(req).then(function (userData) {
    if (userData) {
      res.locals.user = userData.user;
      res.locals.userProjects = userData.projects;
    }

    next();
  }).catch(function (e) {
    logger.error(e);
    next();
  });
});

/**
 * Get current static bundle revision and pass it to the templates
 */
app.use(function (req, res, next) {
  fs.readFile('./public/build/revision.cfg', 'utf8', (err, data) => {
    if (!err) {
      res.locals.bundleRevision = data;
    }

    next();
  });
});

/**
 * Garage
 */
let garage = require('./routes/garage/garage');

app.use('/garage', garage);

/**
 * Yard
 */
let index = require('./routes/yard/index');
let auth = require('./routes/yard/auth/auth');
let unsubscribe = require('./routes/yard/unsubscribe');
let invite = require('./routes/yard/invite');

app.use('/', index);
app.use('/', auth);
app.use('/invite', invite);
app.use('/unsubscribe', unsubscribe);

/**
 * Catcher
 */
let catcher = require('./routes/catcher/catcher');

app.use('/catcher', catcher);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');

  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.ENVIRONMENT === 'DEVELOPMENT' ? err : {};

  /**
   * Log to the console to local development
   */
  if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
    console.log('Error thrown: ', err);
  }

  logger.error('Error thrown: ', err);

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

    global.catchException(err);
  }

  res.render('yard/errors/error', errorPageData);
});

global.app = app;

module.exports = app;
