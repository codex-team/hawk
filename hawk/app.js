'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

require('dotenv').config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
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
var unsubscribe = require('./routes/yard/auth/unsubscribe');
var websites = require('./routes/yard/websites');

app.use('/', index);
app.use('/websites', websites);
app.use('/login', login);
app.use('/logout', logout);
app.use('/join', join);
app.use('/unsubscribe', unsubscribe);



/**
 * Catcher
 */
var catcher = require('./routes/catcher/catcher');
app.use('/catcher', catcher);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.ENVIRONMENT === 'DEVELOPMENT' ? err : {};

  // render the error page
  res.status(err.status || 500);

  let errorPageData;

  if (err.status === 404){
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
