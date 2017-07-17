/**
 *
 * @module hawk/traceback-popup
 * draws and initializes popup with traceback errors.
 *
 * Sends AJAX request and gets rendered html as response to fill in traceback__content element
 */

/**
 * sprintf-js
 * @see https://www.npmjs.com/package/sprintf-js
 */
let vsprintf = require('sprintf-js').vsprintf;

let tracebackPopup = (function ( self ) {
  let keyCodes_ = {
    ESC : 27
  };

  /**
   * @inner
   * List of element classes that needs to find
   */
  let elements_ = {
    eventItems              : 'garage-list-item',
    eventItemTitle          : 'garage-list-item__title',
    tracebackPopup          : 'traceback-popup',
    tracebackContent        : 'traceback-popup__content',
    tracebackClosingButton  : 'traceback-popup__closing-button',
  };

  /**
   * @inner
   * List of CSS styles
   */
  let styles_ = {
    showTracebackPopup  : 'traceback-popup--show',
    popupContentHovered : 'traceback-popup--hovered'
  };

  /**
   * event items
   * @inner
   * @type {Array} - list of found event items
   */
  let eventItems = null;

  /**
   * traceback popup wrapper
   * @inner
   * @type {Element} - popups holder
   */
  let tracebackPopup = null;

  /**
   * popup's content
   * @inner
   * @type {Element} - popups content
   */
  let tracebackContent = null;

  /**
   * popup's closing button
   * @inner
   * @type {Element} - cross button that closes whole popup
   */
  let tracebackClosingButton = null;

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
    eventItems = document.getElementsByClassName(elements_.eventItems);

    tracebackPopup = document.getElementsByClassName(elements_.tracebackPopup);
    tracebackPopup = tracebackPopup.length ? tracebackPopup[0] : null;

    tracebackContent = document.getElementsByClassName(elements_.tracebackContent);
    tracebackContent = tracebackContent.length ? tracebackContent[0] : null;

    tracebackClosingButton = document.getElementsByClassName(elements_.tracebackClosingButton);
    tracebackClosingButton = tracebackClosingButton.length ? tracebackClosingButton[0] : null;

    if (tracebackContent && tracebackClosingButton && eventItems) {
      addClosingButtonHandler_();
      addItemHandlerOnClick_(eventItems);
    }
  };

  /**
   * @static
   *
   * remove all listeners and variables
   */
  self.destroy = function () {
    for (let i = 0; i < eventItems.length; i++) {
      eventItems[i].removeEventListener('click', sendPopupRequest_, false);
    }

    eventItems = null;

    tracebackContent.removeEventListener('mouseover', tracebackContentHovered_, false);
    tracebackContent.removeEventListener('mouseout', tracebackContentHovered_, false);
    tracebackContent = null;

    document.removeEventListener('click', self.close, false);
    document.removeEventListener('keydown', self.close, false);

    tracebackClosingButton.removeEventListener('click', self.close, false);
    tracebackClosingButton = null;
  };

  /**
   * @static
   *
   * delegate closing popup to handlers
   */
  self.close = function (event) {
    switch (event.type) {
      case 'keydown':
        closePopupByEscape_(event);
        break;
      default:
        closePopupByOutsideClick_(event);
    }
  };

  /**
   * Removes class when clicked ESC
   */
  let closePopupByEscape_ = function (event) {
    switch (event.keyCode) {
      case keyCodes_.ESC:
        tracebackPopup.classList.remove(styles_.showTracebackPopup);
        break;
    }
  };

  /**
   * Removes class that display's popup when clicked outsite of popup's content
   */
  let closePopupByOutsideClick_ = function (event) {
    let target = event.target,
      clickedOnPopup = true;

    /**
     * if target is popups content, it means that clicked on popup
     * otherwise if clicked somewhere else, rise until we stop on document's body
     * that will indicate us that click was outside the popup
     */
    while (!target.classList.contains(elements_.tracebackContent)) {
      target = target.parentNode;
      if (target == document.body) {
        clickedOnPopup = false;
        break;
      }
    }

    if (!clickedOnPopup) {
      tracebackPopup.classList.remove(styles_.showTracebackPopup);
    }
  };

  /**
   * @static
   *
   * Adds class that display's popup
   */
  self.open = function () {
    tracebackPopup.classList.add(styles_.showTracebackPopup);

    /** handle traceback content hover */
    tracebackContent.addEventListener('mouseover', tracebackContentHovered_, false);
    tracebackContent.addEventListener('mouseout', tracebackContentHovered_, false);

    /** close by click outside of popup */
    document.addEventListener('click', self.close, false);
    document.addEventListener('keydown', self.close, false);
  };

  /**
   * @inner
   *
   * If content hovered, chande background opacity
   */
  let tracebackContentHovered_ = function (event) {
    switch (event.type) {
      case 'mouseout':
        tracebackPopup.classList.remove(styles_.popupContentHovered);
        break;
      case 'mouseover':
        tracebackPopup.classList.add(styles_.popupContentHovered);
        break;
    }
  };

  /**
   * @inner
   *
   * close popup when cross icon clicked
   */
  let addClosingButtonHandler_ = function () {
    tracebackClosingButton.addEventListener('click', self.close, false);
  };

  /**
   * @inner
   *
   * insert as inner html requested traceback. Response must be rendered template
   */
  let handleSuccessResponse_ = function (response) {
    tracebackContent.insertAdjacentHTML('beforeEnd', response);
    self.open();
  };

  /**
   * @inner
   *
   * Handle cases when something gone wrong
   */
  let handleErrorResponse_ = function (response) {

  };

  /**
   * @inner
   *
   * delegate and add event listeners to the items
   * prevent clicks on items and show popup via traceback content
   *
   * @param {Array} items - found elemens. Delegates elements that found in Initialization proccess
   */
  let addItemHandlerOnClick_ = function (items) {
    for (let i = 0; i < items.length; i++) {
      items[i].addEventListener('click', sendPopupRequest_, false);
    }
  };

  /**
   * @inner
   *
   * send ajax request and delegate to handleSuccessResponse_ on success response
   */
  let sendPopupRequest_ = function (event) {
    event.preventDefault();

    let tracebackHeader = makeTracebackEventHeader_.call(this);

    tracebackContent.innerHTML = tracebackHeader;

    let that = this,
      title = that.getElementsByClassName(elements_.eventItemTitle),
      url = title.length ? title[0].href : null;

    if (url) {
      hawk.ajax.call({
        url: url + '?popup=true',
        method: 'GET',
        success: handleSuccessResponse_,
        error: handleErrorResponse_
      });
    }
  };

  /**
   * get all necessary information from DOM
   * make templated traceback header
   */
  let makeTracebackEventHeader_ = function () {
    let domain = document.querySelector('.garage-header__page-title'),
      errorTag = this.querySelector('.garage-list-item__tag'),
      errorTitle = this.querySelector('.garage-list-item__title'),
      errorCaption = this.querySelector('.garage-list-item__caption'),
      errorCounter = this.querySelector('.garage-list-item__counter');

    errorTag = errorTag.textContent.trim();
    errorTitle = errorTitle.textContent.trim();
    errorCounter = errorCounter.textContent.trim();
    errorCaption = errorCaption.textContent.trim();

    /** get domain name */
    domain = domain.getElementsByTagName('a');
    domain = domain.length ? domain[0] : null;

    if (domain) {
      domain = domain.textContent.trim();
    }

    /** render html */
    let fragment = document.createDocumentFragment();
    let el = `<div class="event">
      <div class="event__header">
        <span class="event__domain">%s</span>
        <span class="event__type event__type--javascript">
          %s
        </span>
      </div>
      <div class="event__content clearfix">
        <div class="event__counter">
          <div class="event__counter-number">
            <div class="event__counter-number--digit">%s</div>
            times
          </div>
          <div class="event__counter-date">since<br>23-06-2017</div>
        </div>
        <div class="event__title">
          %s
        </div>
        <div class="event__path">
          %s
        </div>
      </div>
    </div>`;

    el = vsprintf(el, [domain, errorTag, errorCounter, errorTitle, errorCaption]);
    fragment.innerHTML = el;

    return fragment.innerHTML;
  };

  return self;
})({});

module.exports = tracebackPopup;
