let eventAppender = (function (self) {
  'use strict';

  let settings = {
    domain : null,
    event : null
  };

  let CSS_ = {
    loadMoreButton : 'eventAppender__loadMoreButton'
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
    let block = dom.make('DIV', CSS_.loadMoreButton);

    block.textContent = 'Load more';
    return block;
  };

  let loadMoreEvents_ = function (event) {
    event.preventDefault();

    let me = new Autoloading();

    console.log(me);

    let nextPage = parseInt(currentPage) + 1;
    let requestPage = `/garage/${settings.domain}/event/${settings.event}/?page=${nextPage}`;

    hawk.ajax.call({
      url : requestPage,
      success: function (response) {
        response = JSON.parse(response);

        if (response.traceback) {
          moduleRequiredElement.insertAdjacentHTML('beforeEnd', response.traceback);
        }

        if (response.hideButton) {
          preloader.remove();
        }
        currentPage ++;
      },
      error: function (error) {

      }
    });
  };

  return self;
})({});

module.exports = eventAppender;
