/**
* Require CSS build
*/
require('../stylesheets/hawk.css');

let hawk = (function ( self ) {
  'use strict';

  self.init = function ( ) {
    self.delegate();
    /**
     * Event popup
     */
    self.eventPopup.init();

    /** Settings-form checker for validity */
    self.settingsForm.init();

    console.log('Hawk app initialized');
  };

  self.checkbox = require('./checkbox');
  self.copyable = require('./copyable');
  self.ajax     = require('./ajax');
  self.domain   = require('./domain');
  self.notifier = require('exports-loader?notifier!codex-notifier');
  self.event    = require('./event');
  self.eventPopup   = require('./event-popup');
  self.appender     = require('./module.appender');
  self.settingsForm = require('./settings-form');

  self.delegate = function () {
    let modulesRequired = document.querySelectorAll('[data-module-required]');

    for (let i = 0; i < modulesRequired.length; i++) {
      initModule(modulesRequired[i]);
    }
  };

  /**
   * get's module name from data attributes
   * Calls module with settings that are defined below on <module-settings> tag
   */
  function initModule(foundRequiredModule) {
    let moduleName = foundRequiredModule.dataset.moduleRequired,
        moduleSettings;

    if (self[moduleName]) {
      moduleSettings = foundRequiredModule.querySelector('module-settings');

      if (moduleSettings) {
        moduleSettings = moduleSettings.textContent.trim();
      }

      if (self[moduleName].init) {
        let parsedSettings = JSON.parse(moduleSettings);

        self[moduleName].init.call(foundRequiredModule, parsedSettings);
      }
    }
  };

  return self;
})({});

hawk.docReady = function (f) {
  'use strict';

  return /in/.test(document.readyState) ? window.setTimeout(hawk.docReady, 9, f) : f();
};

module.exports = hawk;
