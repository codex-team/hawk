let eventAppender = (function (self) {
  'use strict';

  let settings = null;

  let autoload = null;

  let preloader = null;

  /**
   * DOM manipulations lib
   * @type {Class}
   */
  var dom = require('./dom').default;

  /**
   * initialize module
   */
  self.init = function () {
    let moduleRequiredElement = document.querySelector('[data-module-required="eventAppender"]');

    if (!moduleRequiredElement) {
      return;
    }

    preloader = makePreLoader_();

    console.log('moduleRequiredElements', moduleRequiredElement);
    moduleRequiredElement.appendChild(preloader);

    let eventPageURL = '/garage/' + '9bb93ff9.ngrok.io' + '/event/cac375abe6c1cc9613246eff37cd6722';

    // hawk.ajax.call({
    //   url : `${eventPageURL}?page=2`,
    //   success: function (response) {
    //     console.log(response);
    //   },
    //   error: function (error) {
    //
    //   }
    // });
  };

  let makePreLoader_ = function () {
    let block = dom.make('DIV');

    block.textContent = 'Load more';

    return block;
  };

  return self;
})({});

module.exports = eventAppender;
