var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var websites = require('./routes/websites');
var garage = require('./routes/garage');

require('dotenv').config();
/** Catcher routes */
var catcher = require('./routes/catcher');

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

app.use('/', index);
app.use('/users', users);
app.use('/websites', websites);
app.use('/garage', garage);

/** use catcher routes */
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
  res.render('error');
});

if (process.env.ENVIRONMENT === 'PRODUCTION') {
  // Vitaly
}

module.exports = app;
