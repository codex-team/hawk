/**
 *
 * @module hawk/traceback-popup
 * draws and initializes popup with traceback errors.
 *
 * Sends AJAX request and gets rendered html as response to fill in traceback__content element
 */

let tracebackPopup = (function ( self ) {
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

    tracebackClosingButton.removeEventListener('click', self.close, false);
    tracebackClosingButton = null;
  };

  /**
   * @static
   *
   * Removes class that display's popup when clicked outsite of popup's content
   */
  self.close = function (event) {
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
    tracebackContent.innerHTML = response;
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

  return self;
})({});

module.exports = tracebackPopup;
