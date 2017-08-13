/**
 *
 * @module hawk/traceback-popup
 * draws and initializes popup with traceback errors.
 *
 * Sends AJAX request and gets rendered html as response to fill in traceback__content element
 */
let eventPopup = (function ( self ) {
  'use strict';

  /**
   * DOM manipulations lib
   * @type {Class}
   */
  let dom = require('./dom').default;

  /**
   * Module holder element
   * @type {null}
   */
  let wrapper = null;

  let keyCodes_ = {
    ESC : 27
  };

  /**
   * Elements classnames
   * @type {Object}
   */
  let CSS = {
    // popup
    popup : 'traceback-popup',
    popupContent: 'traceback-popup__content',
    closeButton: 'traceback-popup__closing-button',
    popupShowed: 'traceback-popup--showed',
    popupLoading: 'traceback-popup--loading',

    // events list
    eventRow: 'garage-list-item'
  };

  /**
   * Popup elements
   * @type {object}
   */
  let popup = {
    holder: null,
    content: null,
    closeButton: null
  };

  /**
   * event rows items
   * @inner
   * @type {Array} - list of found event items
   */
  let eventRows = null;

  /**
   * Current list URL
   * @type {String}
   */
  let eventsListURL = '';

  /**
   * Makes popup elements
   * @return {Object} {holder, closeButton, content}
   */
  function makePopup() {
    let holder = dom.make('div', CSS.popup),
        closeButton = dom.make('div', CSS.closeButton),
        content = dom.make('div', CSS.popupContent);

    holder.appendChild(closeButton);
    holder.appendChild(content);

    return { holder, closeButton, content };
  }

  /**
  * @inner
  *
  * close popup when cross icon clicked
  * @param {Element} button - close button
  */
  let addClosingButtonHandler = function (button) {
    button.addEventListener('click', self.close, false);

    /** close by ESC key */
    document.addEventListener('keydown', self.close, false);
  };

  /**
   * @inner
   *
   * Remove event listeners if popup was closed
   *
   */
  let removeClosingButtonHandler = function () {
    document.removeEventListener('click', self.close, false);
    document.removeEventListener('keydown', self.close, false);
    window.history.replaceState(null, '', eventsListURL);
  };

  /**
   * Removes class when clicked ESC
   */
  let closePopupByEscape_ = function (event) {
    switch (event.keyCode) {
      case keyCodes_.ESC:
        popup.holder.classList.remove(CSS.popupShowed);
        removeClosingButtonHandler();
        break;
    }
  };


  /**
   * Removes class that display's popup when clicked outsite of popup's content
   */
  let closePopupByOutsideClick_ = function (event) {
    let target = event.target,
        clickedOnPopup = true,
        isOpened = popup.holder.classList.contains(CSS.popupShowed);

    if (!isOpened) {
      return;
    }

    /**
     * if target is popups content, it means that clicked on popup
     * otherwise if clicked somewhere else, rise until we stop on document's body
     * that will indicate us that click was outside the popup
     */
    while (!target.classList.contains(CSS.popupContent)) {
      target = target.parentNode;
      if (target === document.body) {
        clickedOnPopup = false;
        break;
      }
    }

    if (!clickedOnPopup) {
      popup.holder.classList.remove(CSS.popupShowed);
      removeClosingButtonHandler();
    }
  };


  /**
   * @static
   *
   * delegate closing popup to handlers
   *
   */
  self.close = function (event) {
    switch (event.type) {
      case 'keydown':
        closePopupByEscape_(event);
        break;
      case 'click':
        closePopupByOutsideClick_(event);
        break;
      case 'popstate':
        popup.holder.classList.remove(CSS.popupShowed);
        removeClosingButtonHandler();
        break;
    }
  };

  /**
   * @static
   *
   * Adds class that display's popup
   */
  self.open = function () {
    /**
     * Handle popup close-button clicks
     */
    addClosingButtonHandler(popup.closeButton);

    popup.holder.classList.add(CSS.popupShowed);

    /** close by click outside of popup */
    window.setTimeout(function () {
      document.addEventListener('click', self.close, false);
    }, 0);
  };

  /**
   * Replace time placeholder with actual text
   * @param  {Number} time  - 1498239391
   */
  function updateHeaderTime(time) {
    if (!time) {
      return;
    }

    let [firstLine, secondLine] = popup.content.querySelectorAll('.event__counter-date .event__placeholder');

    /**
     * Server stores time in milliseconds, client uses seconds
     * @type {Number}
     */
    const milliseconds = 1000;

    let date = new Date(time * milliseconds),
        dateFormatted = date.toGMTString().slice(5, 16),
        newLine = dom.make('span', null, {
          innerHTML : `since <br> ${dateFormatted}`
        });

    dom.replace(firstLine, newLine);
    secondLine.remove();
  }

  /**
   * @inner
   *
   * insert as inner html requested traceback. Response must be rendered template
   * @param {string} response    - server response with JSON:
   *                                  traceback : ''
   *                                  event: {}
   */
  let handleSuccessResponse_ = function (response) {
    /** Remove loader */
    popup.holder.classList.remove(CSS.popupLoading);

    popup.content.insertAdjacentHTML('beforeEnd', response.traceback);
    updateHeaderTime(response.event ? response.event.time : 0);

    /** initialize modules inside html response */
    hawk.initInternalModules(popup.holder);
  };

  /**
   * get all necessary information from DOM
   * make templated traceback header
   * @param {Object} projectName - project name
   * @param {Object} event - traceback header
   * @type {Number} event.count - aggregated event's count
   * @type {Object} event.errorLocation - event's location
   * @type {String} event.message - event's message
   * @type {String} event.tag - event's type
   * @type {Number} event.time - time
   */
  function fillHeader(event, projectName) {
    popup.content.insertAdjacentHTML('afterbegin', `<div class="event">
      <div class="event__header">
        <span class="event__project">${projectName}</span>
        <span class="event__type event__type--${event.tag}">
          ${event.tag === 'javascript' ? 'JavaScript Error' : event.tag}
        </span>
      </div>
      <div class="event__content clearfix">
        <div class="event__counter">
          <div class="event__counter-number">
            <div class="event__counter-number--digit">${event.count}</div>
            times
          </div>
          <div class="event__counter-date">
            <div class="event__placeholder"></div>
            <div class="event__placeholder"></div>
          </div>
        </div>
        <div class="event__title">
          ${event.message}
        </div>
        <div class="event__path">
          ${event.errorLocation.full}
        </div>
      </div>
    </div>`);
  }

  /**
   * @inner
   *
   * send ajax request and delegate to handleSuccessResponse_ on success response
   *
   * @param event
   * @param eventUrl
   *
   * @param {string} event._id
   * @param {string} event.type
   * @param {string} event.tag
   * @param {Object} event.errorLocation
   * @param {string} event.message
   * @param {number} event.time
   * @param {number} event.count
   */
  let sendPopupRequest_ = function (event, eventUrl) {
    if (!eventUrl) {
      return;
    }

    /** Open popup with known data */
    self.open();

    eventsListURL = document.location.pathname;

    /** Replace current URL and add new history record */
    window.history.pushState({ 'popupOpened': true }, event.message, eventUrl);

    /** Add loader */
    popup.holder.classList.add(CSS.popupLoading);

    hawk.ajax.call({
      url: `${eventUrl}?popup=true`,
      method: 'GET',
      success: handleSuccessResponse_,
      error: err => {
        hawk.notifier.show({style: 'error', message: 'Cannot load event data'});
        console.log('Event loading error: %o', err);

        /** Remove loader */
        popup.holder.classList.remove(CSS.popupLoading);
      }
    });
  };

  /**
   * Event row click handler
   * @param  {event} clickEvent - onclick event
   */
  function eventRowClicked(clickEvent) {
    let row = this;

    /**
    * Allow opening page in new tab
    */
    let isMouseWheelClicked = clickEvent.which && ( clickEvent.which === 2 || clickEvent.button === 4 );

    if (clickEvent.ctrlKey || clickEvent.metaKey || isMouseWheelClicked) {
      return;
    }


    let event = row.dataset.event,
        projectName = row.dataset.project,
        eventUrl = row.href;

    event = JSON.parse(event);

    /**
     * Clear popup
     */
    popup.content.innerHTML = '';

    /**
     * Fill popup header with data we are already have
     */
    fillHeader(event, projectName);

    /**
     * Require other information
     */
    sendPopupRequest_(event, eventUrl);

    /**
     * Disable link segue
     */
    clickEvent.preventDefault();
  }

  /**
   * @inner
   *
   * delegate and add event listeners to the items
   * prevent clicks on items and show popup via traceback content
   *
   * @param {Array} items - list of Event rows. Delegates elements that found in Initialization proccess
   */
  let bindRowsClickHandler = function (items) {
    if (!items || !items.length) {
      return;
    }

    for (let i = items.length - 1; i >= 0; i--) {
      items[i].addEventListener('click', eventRowClicked, false);
    }
  };


  /**
   * @static
   *
   * remove all listeners and variables
   */
  self.destroy = function () {
    for (let i = 0; i < eventRows.length; i++) {
      eventRows[i].removeEventListener('click', sendPopupRequest_, false);
    }

    eventRows = null;
    eventsListURL = null;

    document.removeEventListener('click', self.close, false);
    document.removeEventListener('keydown', self.close, false);

    popup.closeButton.removeEventListener('click', self.close, false);
  };

  /**
   * @static
   *
   * Initialize traceback popup module
   * find all necessary elements and add listeners
   *
   * If non of this elements found, do not Initialize module
   * In case when something gone wrong, check that all elements has been found before delegation
   */
  self.init = function () {
    wrapper = this;

    popup = makePopup();

    document.body.appendChild(popup.holder);

    /**
     * Handle clicks on rows
     */
    eventRows = wrapper.querySelectorAll(`.${CSS.eventRow}`);
    bindRowsClickHandler(eventRows);

    /** Close popup by Back/Forward navigation */
    window.onpopstate = function (e) {
      if(!e.state || !e.state.popupOpened) {
        self.close(e);
      }
    };
  };

  /**
   * Update elements click handler
   */
  self.update = function () {
    if (!wrapper) {
      return;
    }

    /**
     * Handle clicks on rows
     */
    eventRows = wrapper.querySelectorAll(`.${CSS.eventRow}`);
    bindRowsClickHandler(eventRows);
  };

  return self;
})({});

module.exports = eventPopup;
