const ajax = require('codex.ajax');

/**
 * File transport module
 *
 * @module Transport module. Upload file and return response from server
 * @copyright CodeX Team 2017
 */

module.exports = function (transport) {
  'use strict';

  /** Empty configuration */

  let config_ = null;

  /** File holder */
  transport.input = null;

  let clickInput_ = function clickInput_() {
    transport.input.click();
  };

  /**
   * Before function decorator. Call config_.before with passed files
   *
   * @private
   */
  let before_ = function () {
    config_.before(transport.input.files);
  };

  /**
   * Sends transport AJAX request
   */
  let send_ = function send_() {
    let url = config_.url,
        data = config_.data,
        before = before_,
        progress = config_.progress,
        success = config_.success,
        error = config_.error,
        after = config_.after,
        formData = new FormData(),
        files = transport.input.files;

    if (files.length > 1) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files[]', files[i], files[i].name);
      }
    } else {
      formData.append('file', files[0], files[0].name);
    }

    /**
         * Append additional data
         */
    if (data !== null && typeof data === 'object') {
      for (let key in data) {
        formData.append(key, data[key]);
      }
    }

    ajax.call({
      type: 'POST',
      data: formData,
      url: url,
      before: before,
      progress: progress,
      success: success,
      error: error,
      after: after
    });
  };

  /** initialize module */
  transport.init = function (configuration) {
    if (!configuration.url) {
      console.log('Can\'t send request because `url` is missed');
      return;
    }

    config_ = configuration;

    let inputElement = document.createElement('INPUT');

    inputElement.type = 'file';

    if (config_ && config_.multiple) {
      inputElement.setAttribute('multiple', 'multiple');
    }

    if (config_ && config_.accept) {
      inputElement.setAttribute('accept', config_.accept);
    }

    inputElement.addEventListener('change', send_, false);

    /** Save input */
    transport.input = inputElement;

    /** click input to show upload window */
    clickInput_();
  };

  return transport;
}({});
