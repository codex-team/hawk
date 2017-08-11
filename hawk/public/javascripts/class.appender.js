'use strict';

let dom = require('./dom').default;

/**
 * Class Appender
 * @constructor
 * @type {Object} settings
 * @type {String} settings.url - sends requests to this URL to get items
 * @type {Function} settings.init - function will be called with "load more button"
 * @type {Function} settings.appendItemsOnLoad - function will be called after servers response
 *
 *
 * Usage:
 *   new Appender({
 *     url : YOUR URL,
 *     init : YOUR CUSTOM CALLBACK,
 *     appendItemsOnLoad : YOUR CUSTOM CALLBACK,
 *     onError : YOUR CALLBACK
 *   })
 *
 */
export class Appender {
  /**
   * Class internal properties:
   * @property {Object} settings - comes outsite
   * @property {Boolean} autoload - load data by scroll
   * @property {Number} nextPage - page rotation
   * @property {Object} CSS - styles
   */
  constructor(settings) {
    this.settings = settings;
    this.nextPage = 2;
    this.allowedAutoloading = false;

    this.CSS = {
      loadMoreButton : 'eventAppender__loadMoreButton'
    };

    this.loadMoreButton = this.drawLoadMoreButton();
    this.loadMoreButton.addEventListener('click', this.loadMoreEvents.bind(this), false);

    /** call init method with button */
    this.settings.init(this.loadMoreButton);

    if (this.settings.autoloading) {
      this.allowedAutoloading = true;
    }

    if (this.settings.dontWaitFirstClick) {
      this.loadByScroll();
    }
  };

  /**
   * Draws load more button
   */
  drawLoadMoreButton() {
    let block = dom.make('DIV', this.CSS.loadMoreButton, {
      textContent: 'Load more'
    });

    return block;
  };

  /**
   * load data by scroll
   */
  loadByScroll() {
    if (!this.allowedAutoloading) {
      return;
    }
  }

  /**
   * Sends a request to the server
   * After getting response calls {settings.appendItemsOnLoad} Function
   */
  loadMoreEvents(event) {
    event.preventDefault();

    hawk.ajax.call({
      url : this.settings.url + this.nextPage,
      beforeSend : this.beforeSend.bind(this),
      success: this.successCallback.bind(this),
      error: this.errorCallback.bind(this)
    });

    this.loadByScroll();
  };

  /**
   * Append spinner
   */
  beforeSend() {
    this.loadMoreButton.classList.add('spinner');
  }

  /**
   * remove "load more button" if server says "can't load more"
   * call Customized callback with response
   */
  successCallback(response) {
    this.loadMoreButton.classList.remove('spinner');
    if (!response.canLoadMore) {
      this.loadMoreButton.remove();
    }

    this.nextPage++;
    this.settings.appendItemsOnLoad(response);
  };

  /**
   * Handle error responses
   */
  errorCallback(error) {
    if (error) {
      this.settings.onError(error);
    }
  };
}
