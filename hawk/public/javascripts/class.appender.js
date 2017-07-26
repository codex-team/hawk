'use strict';

var dom = require('./dom').default;

export class Appender {
  constructor(settings) {
    this.settings = settings;
    this.autoload = null;
    this.nextPage = 1;
    this.currentPage = 1;

    this.CSS = {
      loadMoreButton : 'eventAppender__loadMoreButton'
    };

    this.preloader = this.makePreLoader_();
    this.preloader.addEventListener('click', this.loadMoreEvents_.bind(this), false);

    this.settings.init(this.preloader);
  };

  makePreLoader_() {
    let block = dom.make('DIV', this.CSS.loadMoreButton);

    block.textContent = 'Load more';

    return block;
  };

  loadMoreEvents_(event) {
    event.preventDefault();

    hawk.ajax.call({
      url : this.settings.url + this.nextPage,
      success: successCallback.bind(this),
      error: function (error) {

      }
    });

    function successCallback(response) {
      response = JSON.parse(response);

      if (response.hideButton) {
        this.preloader.remove();
      }

      this.nextPage++;
      this.settings.appendItemsOnLoad(response.traceback);
    }
  }
};
