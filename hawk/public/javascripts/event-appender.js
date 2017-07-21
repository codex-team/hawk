let eventAppender = (function (self) {
  'use strict';

  let settings = null;

  let autoload = null;

  let preloader = null;

  let currentPage = 1;

  let moduleRequiredElement = null;

  /**
   * DOM manipulations lib
   * @type {Class}
   */
  var dom = require('./dom').default;

  /**
   * initialize module
   */
  self.init = function () {
    moduleRequiredElement = document.querySelector('[data-module-required="eventAppender"]');

    if (!moduleRequiredElement) {
      return;
    }

    preloader = makePreLoader_();

    console.log('moduleRequiredElements', moduleRequiredElement);
    moduleRequiredElement.after(preloader);
  };

  let makePreLoader_ = function () {
    let block = dom.make('DIV');

    block.textContent = 'Load more';
    block.addEventListener('click', loadMore_, false);

    return block;
  };

  let loadMore_ = function () {
    let requestPage = '/garage/guryn.me/event/cac375abe6c1cc9613246eff37cd6722/?page=' + (parseInt(currentPage) + 1);

    hawk.ajax.call({
      url : requestPage,
      success: function (response) {
        response = JSON.parse(response);
        moduleRequiredElement.insertAdjacentHTML('beforeEnd', response.traceback);
        currentPage ++;
      },
      error: function (error) {

      }
    });
  };

  return self;
})({});

module.exports = eventAppender;
