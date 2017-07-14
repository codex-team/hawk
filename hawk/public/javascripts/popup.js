let popup = (function ( self ) {

  /**
   * List of element classes that needs to find
   */
  let elements_ = {
    eventItems              : 'garage-list-item',
    eventItemTitle          : 'garage-list-item__title',
    tracebackPopup          : 'traceback-popup',
    tracebackContent        : 'traceback-popup__content',
    tracebackClosingButton  : 'traceback-popup__closing-button',
  };

  let styles_ = {
    showTracebackPopup : 'traceback-popup--show'
  };

  /**
   * event items
   */
  let errorItems = null;

  /**
   * traceback popup wrapper
   */
  let tracebackPopup = null;

  /**
   * popup's content
   */
  let tracebackContent = null;

  /**
   * popup's closing button
   */
  let tracebackClosingButton = null;

  /**
   * @protected
   * Initialize popup module.
   * find all necessary elements and add listeners
   */
  self.init = function () {

    errorItems = document.getElementsByClassName(elements_.eventItems);

    tracebackPopup = document.getElementsByClassName(elements_.tracebackPopup);
    tracebackPopup = tracebackPopup.length ? tracebackPopup[0] : null;

    tracebackContent = document.getElementsByClassName(elements_.tracebackContent);
    tracebackContent = tracebackContent.length ? tracebackContent[0] : null;

    tracebackClosingButton = document.getElementsByClassName(elements_.tracebackClosingButton);
    tracebackClosingButton = tracebackClosingButton.length ? tracebackClosingButton[0] : null;

    if (tracebackContent && tracebackClosingButton && errorItems) {

      addClosingButtonHandler_();
      addItemHandlerOnClick_(errorItems);

    }

  };

  /**
   * @protected
   * Removes class that display's popup
   */
  self.close = function () {

    tracebackPopup.classList.remove(styles_.showTracebackPopup);

  };

  /**
   * @protected
   * Adds class that display's popup
   */
  self.open = function () {

    tracebackPopup.classList.add(styles_.showTracebackPopup);

  };

  /**
   * @private
   * close popup when cross icon clicked
   */
  let addClosingButtonHandler_ = function () {

    tracebackClosingButton.addEventListener('click', function () {

      self.close();

    }, false);

  };

  let sendPopupRequest_ = function (event) {

    // event.preventDefault();

    console.log('her');
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

  let handleSuccessResponse_ = function (response) {

    tracebackContent.innerHTML = response;
    self.open();

  };

  let handleErrorResponse_ = function (response) {

  };

  /**
   * @private
   *
   * delegate and add event listeners to the items
   * prevent clicks on items and show popup via traceback content
   *
   * @param {Object} items - found elemens
   */
  let addItemHandlerOnClick_ = function (items) {

    for (let i = 0; i < items.length; i++) {

      items[i].addEventListener('click', sendPopupRequest_, false);

    }



  };

  return self;

})({});

module.exports = popup;
