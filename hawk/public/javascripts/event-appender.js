let eventAppender = (function (self) {
  'use strict';

  let settings = {
    domain : null,
    event : null
  };

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

    settings.domain = moduleRequiredElement.dataset.domain;
    settings.event  = moduleRequiredElement.dataset.event;

    preloader = makePreLoader_();

    preloader.addEventListener('click', loadMoreEvents_, false);
    moduleRequiredElement.after(preloader);
  };

  let makePreLoader_ = function () {
    let block = dom.make('DIV');

    block.textContent = 'Load more';

    return block;
  };

  let loadMoreEvents_ = function () {
    let nextPage = parseInt(currentPage) + 1;
    let requestPage = `/garage/${settings.domain}/event/${settings.event}/?page=${nextPage}`;

    hawk.ajax.call({
      url : requestPage,
      success: function (response) {
        response = JSON.parse(response);
        console.log('response', response);
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
