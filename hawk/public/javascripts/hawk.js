/**
* Require CSS build
*/
require('../stylesheets/hawk.css');

let hawk = (function ( self ) {

  'use strict';

  self.init = function ( ) {

    self.popup.init();
    console.log('Initialized');

  };

  self.checkbox = require('./checkbox');
  self.copyable = require('./copyable');
  self.ajax     = require('./ajax');
  self.domain   = require('./domain');
  self.notifier = require('exports-loader?notifier!codex-notifier');
  self.popup    = require('./popup');

  return self;

})({});

hawk.docReady = function (f) {

  'use strict';

  return /in/.test(document.readyState) ? window.setTimeout(hawk.docReady, 9, f) : f();

};

module.exports = hawk;
