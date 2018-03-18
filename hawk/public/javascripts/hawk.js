/**
 * Require CSS build
 */
require('../stylesheets/hawk.css');

let hawkso = (function (self) {
  'use strict';

  self.init = function () {
    delegate();

    /** Settings-form checker for validity */
    self.settingsForm.init();

    /** Custom keyboard events **/

    self.keyboard.init();

    console.log('Hawk app initialized');
  };

  self.checkbox = require('./checkbox');
  self.copyable = require('./copyable');
  self.ajax = require('./ajax');
  self.notifier = require('exports-loader?notifier!codex-notifier');
  self.event = require('./event');
  self.eventPopup = require('./event-popup');
  self.appender = require('./module.appender');
  self.settingsForm = require('./settings-form');
  self.toggler = require('./toggler');
  self.keyboard = require('./keyboard');
  self.projectSettings = require('./projectSettings');

  let delegate = function (element) {
    let modulesRequired;

    if (element) {
      modulesRequired = element.querySelectorAll('[data-module-required]');
    } else {
      modulesRequired = document.querySelectorAll('[data-module-required]');
    }

    for (let i = 0; i < modulesRequired.length; i++) {
      initModule(modulesRequired[i]);
    }
  };

  self.initInternalModules = function (element) {
    delegate(element);
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
  }

  return self;
})({});

hawkso.docReady = function (f) {
  'use strict';

  return /in/.test(document.readyState) ? window.setTimeout(hawkso.docReady, 9, f) : f();
};

module.exports = hawkso;
