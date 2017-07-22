var hawk =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * DOM manipulations methods
 */
var DOM = function () {
  function DOM() {
    _classCallCheck(this, DOM);
  }

  _createClass(DOM, null, [{
    key: "make",

    /**
     * Helper for making Elements with classname and attributes
     * @param  {string} tagName           - new Element tag name
     * @param  {array|string} classNames  - list or name of CSS classname(s)
     * @param  {Object} attributes        - any attributes
     * @return {Element}
     */
    value: function make(tagName, classNames, attributes) {
      var el = document.createElement(tagName);

      if (Array.isArray(classNames)) {
        var _el$classList;

        (_el$classList = el.classList).add.apply(_el$classList, _toConsumableArray(classNames));
      } else if (classNames) {
        el.classList.add(classNames);
      }

      for (var attrName in attributes) {
        el[attrName] = attributes[attrName];
      }

      return el;
    }

    /**
    * Replaces node with
    * @param {Element} nodeToReplace
    * @param {Element} replaceWith
    */

  }, {
    key: "replace",
    value: function replace(nodeToReplace, replaceWith) {
      return nodeToReplace.parentNode.replaceChild(replaceWith, nodeToReplace);
    }
  }]);

  return DOM;
}();

exports.default = DOM;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * AJAX module
 */
module.exports = function () {
  /**
   * @usage codex.ajax.call();
   */
  var call = function call(data) {
    if (!data || !data.url) return;

    var XMLHTTP = window.XMLHttpRequest ? new window.XMLHttpRequest() : new window.ActiveXObject('Microsoft.XMLHTTP'),
        successFunction = function successFunction() {},
        errorFunction = function errorFunction() {};

    data.async = true;
    data.type = data.type || 'GET';
    data.data = data.data || '';
    data['content-type'] = data['content-type'] || 'application/json; charset=utf-8';
    successFunction = data.success || successFunction;
    errorFunction = data.error || errorFunction;

    if (data.type === 'GET' && data.data) {
      data.url = /\?/.test(data.url) ? data.url + '&' + data.data : data.url + '?' + data.data;
    }

    if (data.withCredentials) {
      XMLHTTP.withCredentials = true;
    }

    if (data.beforeSend && typeof data.beforeSend === 'function') {
      if (!data.beforeSend.call()) {
        return;
      }
    }

    XMLHTTP.open(data.type, data.url, data.async);

    /**
     * If we send FormData, we need no content-type header
     */
    if (!isFormData_(data.data)) {
      XMLHTTP.setRequestHeader('Content-type', data['content-type']);
    }

    XMLHTTP.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    XMLHTTP.onreadystatechange = function () {
      if (XMLHTTP.readyState === 4) {
        if (XMLHTTP.status === 200) {
          successFunction(XMLHTTP.responseText);
        } else {
          errorFunction(XMLHTTP.statusText);
        }
      }
    };

    XMLHTTP.send(data.data);
  };

  /**
   * Function for checking is it FormData object to send.
   * @param {Object} object to check
   * @return boolean
   */
  var isFormData_ = function isFormData_(object) {
    return object instanceof FormData;
  };

  return {

    call: call

  };
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Custom checkboxes module
 *
 * Just add name 'custom-checkbox' to element
 * Use data attributes to configure inputs:
 *  - data-name    -- input name
 *  - data-value   -- (optional) input value
 *  - data-checked -- (optional) default input state
 *
 * @usage
 * <label name='custom-checkbox'
 *        class='form__checkbox'
 *        data-name='my-checkbox'
 *        data-checked='true'>
 *
 *      My checkbox
 *
 * </label>
 *
 *
 * @type {{init}}
 */
module.exports = function () {
  var CLASSES = {
    customCheckbox: 'form__checkbox',
    checkedCheckbox: 'form__checkbox--checked',
    defaultCheckbox: 'default-checkbox'
  };

  var NAMES = {
    customChecbox: 'custom-checkbox'
  };

  /**
   * Prepare elements with 'custom-checkbox' name
   */
  var init = function init() {
    var checkboxes = document.getElementsByName(NAMES.customChecbox);

    if (!checkboxes) {
      console.log('There are no checkboxes on page');
      return;
    }

    for (var i = 0; i < checkboxes.length; i++) {
      prepareElement(checkboxes[i]);
    }

    console.log('Checkboxes initialized');
  };

  /**
   * Insert default input into custom checkbox holder and add click listener to holder
   *
   * @param checkbox
   */
  var prepareElement = function prepareElement(checkbox) {
    var input = document.createElement('input');

    input.type = 'checkbox';
    input.classList.add(CLASSES.defaultCheckbox);

    input.name = checkbox.dataset.name;

    if (checkbox.dataset.value) {
      input.value = checkbox.dataset.value;
    }

    if (checkbox.dataset.checked) {
      checkbox.classList.add(CLASSES.checkedCheckbox);
      input.checked = true;
    }

    checkbox.appendChild(input);
    checkbox.addEventListener('click', checkboxClicked);
  };

  /**
   * Add CLASSES.checkedCheckbox class to custom checkbox holder and toggle default input state
   *
   * @param e
   */
  var checkboxClicked = function checkboxClicked(e) {
    var label = this,
        input = this.querySelector('.' + CLASSES.defaultCheckbox);

    label.classList.toggle(CLASSES.checkedCheckbox);
    input.checked = !input.checked;

    e.preventDefault();
  };

  return {
    init: init
  };
}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyable module allows you to add text to copy buffer by click
 * Just add 'js-copyable' name to element and call init method
 *
 * @usage
 * <span name='js-copyable'>Click to copy</span>
 *
 * You can pass callback function to init method. Callback will fire when something has copied
 *
 * @type {{init}}
 */
module.exports = function () {
  var NAMES = {
    copyable: 'js-copyable'
  };

  /**
   * Take element by name and pass it to prepareElement function
   *
   * @param {Function} copiedCallback - fires when something has copied
   */
  var init = function init(copiedCallback) {
    var elems = document.getElementsByName(NAMES.copyable);

    if (!elems) {
      console.log('There are no copyable elements');
      return;
    }

    for (var i = 0; i < elems.length; i++) {
      prepareElement(elems[i], copiedCallback);
    }

    console.log('Copyable module initialized');
  };

  /**
   * Add click and copied listeners to copyable element
   *
   * @param element
   * @param copiedCallback
   */
  var prepareElement = function prepareElement(element, copiedCallback) {
    element.addEventListener('click', elementClicked);
    element.addEventListener('copied', copiedCallback);
  };

  /**
   * Click handler
   * Create new range, select copyable element and add range to selection. Then exec 'copy' command
   */
  var elementClicked = function elementClicked() {
    var selection = window.getSelection(),
        range = document.createRange();

    range.selectNodeContents(this);
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand('copy');
    selection.removeAllRanges();

    /**
     * We create new CustomEvent and dispatch it on copyable element
     * Consist copied text in detail property
     */
    var CopiedEvent = new CustomEvent('copied', {
      bubbles: false,
      cancelable: false,
      detail: range.toString()
    });

    this.dispatchEvent(CopiedEvent);
  };

  return {
    init: init
  };
}();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
  /**
   * Unlink domain handler
   *
   * @param button
   * @param token - domain token
   */
  var unlink = function unlink(button, token) {
    var success = function success() {
      hawk.notifier.show({
        message: 'Domain was successfully unlinked',
        style: 'success'
      });
      button.parentNode.remove();
    };

    var error = function error() {
      hawk.notifier.show({
        message: 'Sorry, there is a server error',
        style: 'error'
      });
    };

    var sendAjax = function sendAjax() {
      hawk.ajax.call({
        data: 'token=' + token,
        type: 'GET',
        success: success,
        error: error,
        url: 'settings/unlink'
      });
    };

    var domain = button.dataset.name;

    hawk.notifier.show({
      message: 'Confirm ' + domain + ' unlinking',
      type: 'confirm',
      okText: 'Unlink',
      okHandler: sendAjax
    });
  };

  return {
    unlink: unlink
  };
}();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var eventAppender = function (self) {
  'use strict';

  var settings = {
    domain: null,
    event: null
  };

  var autoload = null;

  var preloader = null;

  var currentPage = 1;

  var moduleRequiredElement = null;

  /**
   * DOM manipulations lib
   * @type {Class}
   */
  var dom = __webpack_require__(0).default;

  /**
   * initialize module
   */
  self.init = function () {
    moduleRequiredElement = document.querySelector('[data-module-required="eventAppender"]');

    if (!moduleRequiredElement) {
      return;
    }

    settings.domain = moduleRequiredElement.dataset.domain;
    settings.event = moduleRequiredElement.dataset.event;

    preloader = makePreLoader_();

    preloader.addEventListener('click', loadMoreEvents_, false);
    moduleRequiredElement.after(preloader);
  };

  var makePreLoader_ = function makePreLoader_() {
    var block = dom.make('DIV');

    block.textContent = 'Load more';

    return block;
  };

  var loadMoreEvents_ = function loadMoreEvents_() {
    var nextPage = parseInt(currentPage) + 1;
    var requestPage = '/garage/' + settings.domain + '/event/' + settings.event + '/?page=' + nextPage;

    hawk.ajax.call({
      url: requestPage,
      success: function success(response) {
        response = JSON.parse(response);
        console.log('response', response);
        moduleRequiredElement.insertAdjacentHTML('beforeEnd', response.traceback);
        currentPage++;
      },
      error: function error(_error) {}
    });
  };

  return self;
}({});

module.exports = eventAppender;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 *
 * @module hawk/traceback-popup
 * draws and initializes popup with traceback errors.
 *
 * Sends AJAX request and gets rendered html as response to fill in traceback__content element
 */
var eventPopup = function (self) {
  'use strict';

  /**
   * DOM manipulations lib
   * @type {Class}
   */

  var dom = __webpack_require__(0).default;

  var keyCodes_ = {
    ESC: 27
  };

  /**
   * Elements classnames
   * @type {Object}
   */
  var CSS = {
    // popup
    popup: 'traceback-popup',
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
  var popup = {
    holder: null,
    content: null,
    closeButton: null
  };

  /**
   * event rows items
   * @inner
   * @type {Array} - list of found event items
   */
  var eventRows = null;

  /**
   * Current list URL
   * @type {String}
   */
  var eventsListURL = '';

  /**
   * Makes popup elements
   * @return {Object} {holder, closeButton, content}
   */
  function makePopup() {
    var holder = dom.make('div', CSS.popup),
        closeButton = dom.make('div', CSS.closeButton),
        content = dom.make('div', CSS.popupContent);

    holder.appendChild(closeButton);
    holder.appendChild(content);

    return { holder: holder, closeButton: closeButton, content: content };
  }

  /**
  * @inner
  *
  * close popup when cross icon clicked
  * @param {Element} button - close button
  */
  var addClosingButtonHandler = function addClosingButtonHandler(button) {
    button.addEventListener('click', self.close, false);

    /** close by ESC key */
    document.addEventListener('keydown', self.close, false);
  };

  /**
   * Removes class when clicked ESC
   */
  var closePopupByEscape_ = function closePopupByEscape_(event) {
    switch (event.keyCode) {
      case keyCodes_.ESC:
        popup.holder.classList.remove(CSS.popupShowed);
        break;
    }
  };

  /**
   * Removes class that display's popup when clicked outsite of popup's content
   */
  var closePopupByOutsideClick_ = function closePopupByOutsideClick_(event) {
    var target = event.target,
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
        break;
    }

    document.removeEventListener('click', self.close, false);
    window.history.replaceState(null, '', eventsListURL);
  };

  /**
   * @static
   *
   * Adds class that display's popup
   */
  self.open = function () {
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

    var _popup$content$queryS = popup.content.querySelectorAll('.event__counter-date .event__placeholder'),
        _popup$content$queryS2 = _slicedToArray(_popup$content$queryS, 2),
        firstLine = _popup$content$queryS2[0],
        secondLine = _popup$content$queryS2[1];

    /**
     * Server stores time in milliseconds, client uses seconds
     * @type {Number}
     */


    var milliseconds = 1000;

    var date = new Date(time * milliseconds),
        dateFormatted = date.toGMTString().slice(5, 16),
        newLine = dom.make('span', null, {
      innerHTML: 'since <br> ' + dateFormatted
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
  var handleSuccessResponse_ = function handleSuccessResponse_(response) {
    response = JSON.parse(response);

    /** Remove loader */
    popup.holder.classList.remove(CSS.popupLoading);

    popup.content.insertAdjacentHTML('beforeEnd', response.traceback);
    updateHeaderTime(response.event ? response.event.time : 0);
  };

  /**
   * get all necessary information from DOM
   * make templated traceback header
   * @param {Object} domainName - domain name
   * @param {Object} event - traceback header
   * @type {Integer} event.count - aggregated event's count
   * @type {Object} event.errorLocation - event's location
   * @type {String} event.message - event's message
   * @type {String} event.tag - event's type
   * @type {Integer} event.time - time
   */
  function fillHeader(event, domainName) {
    popup.content.insertAdjacentHTML('afterbegin', '<div class="event">\n      <div class="event__header">\n        <span class="event__domain">' + domainName + '</span>\n        <span class="event__type event__type--' + event.tag + '">\n          ' + (event.tag === 'javascript' ? 'JavaScript Error' : event.tag) + '\n        </span>\n      </div>\n      <div class="event__content clearfix">\n        <div class="event__counter">\n          <div class="event__counter-number">\n            <div class="event__counter-number--digit">' + event.count + '</div>\n            times\n          </div>\n          <div class="event__counter-date">\n            <div class="event__placeholder"></div>\n            <div class="event__placeholder"></div>\n          </div>\n        </div>\n        <div class="event__title">\n          ' + event.message + '\n        </div>\n        <div class="event__path">\n          ' + event.errorLocation.full + '\n        </div>\n      </div>\n    </div>');
  }

  /**
   * @inner
   *
   * send ajax request and delegate to handleSuccessResponse_ on success response
   *
   * @param {string} domainName
   *
   * @param {string} event._id
   * @param {string} event.type
   * @param {string} event.tag
   * @param {Object} event.errorLocation
   * @param {string} event.message
   * @param {number} event.time
   * @param {number} event.count
   */
  var sendPopupRequest_ = function sendPopupRequest_(event, domainName) {
    if (!domainName) {
      return;
    }

    var eventPageURL = '/garage/' + domainName + '/event/' + event._id;

    /** Open popup with known data */
    self.open();

    eventsListURL = document.location.pathname;

    /** Replace current URL and add new history record */
    window.history.pushState({ 'popupOpened': true }, event.message, eventPageURL);

    /** Add loader */
    popup.holder.classList.add(CSS.popupLoading);

    hawk.ajax.call({
      url: eventPageURL + '?popup=true',
      method: 'GET',
      success: handleSuccessResponse_,
      error: function error(err) {
        hawk.notifier.show({ style: 'error', message: 'Cannot load event data' });
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
    var row = this;

    /**
    * Allow opening page in new tab
    */
    var isMouseWheelClicked = clickEvent.which && (clickEvent.which === 2 || clickEvent.button === 4);

    if (clickEvent.ctrlKey || clickEvent.metaKey || isMouseWheelClicked) {
      return;
    }

    var event = row.dataset.event,
        domainName = row.dataset.domain;

    event = JSON.parse(event);

    /**
     * Clear popup
     */
    popup.content.innerHTML = '';

    /**
     * Fill popup header with data we are already have
     */
    fillHeader(event, domainName);

    /**
     * Require other information
     */
    sendPopupRequest_(event, domainName);

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
  var bindRowsClickHandler = function bindRowsClickHandler(items) {
    if (!items || !items.length) {
      return;
    }

    for (var i = items.length - 1; i >= 0; i--) {
      items[i].addEventListener('click', eventRowClicked, false);
    }
  };

  /**
   * @static
   *
   * remove all listeners and variables
   */
  self.destroy = function () {
    for (var i = 0; i < eventRows.length; i++) {
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
    var isNeed = document.querySelector('[data-module-required="eventPopup"]');

    if (!isNeed) {
      return;
    }

    popup = makePopup();

    document.body.appendChild(popup.holder);

    /**
     * Handle popup close-button clicks
     */
    addClosingButtonHandler(popup.closeButton);

    /**
     * Handle clicks on rows
     */
    eventRows = document.querySelectorAll('.' + CSS.eventRow);
    bindRowsClickHandler(eventRows);

    /** Close popup by Back/Forward navigation */
    window.onpopstate = function (e) {
      if (!e.state || !e.state.popupOpened) {
        self.close(e);
      }
    };
  };

  return self;
}({});

module.exports = eventPopup;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
  /**
   * Hide and show error repeations stack on event page
   *
   * @param stackButton
   * @param eventId
   */
  var toggleStack = function toggleStack(stackButton, eventId) {
    var eventInfo = document.querySelector('.event-info[data-event="' + eventId + '"]');

    eventInfo.classList.toggle('hide');
    stackButton.classList.toggle('event-info--opened');
  };

  return {
    toggleStack: toggleStack
  };
}();

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var notifier = function (e) {
  function t(r) {
    if (n[r]) return n[r].exports;var c = n[r] = { i: r, l: !1, exports: {} };return e[r].call(c.exports, c, c.exports, t), c.l = !0, c.exports;
  }var n = {};return t.m = e, t.c = n, t.i = function (e) {
    return e;
  }, t.d = function (e, n, r) {
    t.o(e, n) || Object.defineProperty(e, n, { configurable: !1, enumerable: !0, get: r });
  }, t.n = function (e) {
    var n = e && e.__esModule ? function () {
      return e.default;
    } : function () {
      return e;
    };return t.d(n, "a", n), n;
  }, t.o = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }, t.p = "", t(t.s = 2);
}([function (e, t, n) {
  "use strict";
  e.exports = function () {
    var e = { wrapper: "cdx-notifies", notification: "cdx-notify", crossBtn: "cdx-notify__cross", okBtn: "cdx-notify__button--confirm", cancelBtn: "cdx-notify__button--cancel", input: "cdx-notify__input", btn: "cdx-notify__button", btnsWrapper: "cdx-notify__btns-wrapper" },
        t = function t(_t) {
      var n = document.createElement("DIV"),
          r = document.createElement("DIV"),
          c = _t.message,
          i = _t.style;return n.classList.add(e.notification), i && n.classList.add(e.notification + "--" + i), n.innerHTML = c, r.classList.add(e.crossBtn), r.addEventListener("click", n.remove.bind(n)), n.appendChild(r), n;
    };return { alert: t, confirm: function confirm(n) {
        var r = t(n),
            c = document.createElement("div"),
            i = document.createElement("button"),
            a = document.createElement("button"),
            o = r.querySelector(e.crossBtn),
            d = n.cancelHandler,
            s = n.okHandler;return c.classList.add(e.btnsWrapper), i.innerHTML = n.okText || "Confirm", a.innerHTML = n.cancelText || "Cancel", i.classList.add(e.btn), a.classList.add(e.btn), i.classList.add(e.okBtn), a.classList.add(e.cancelBtn), d && "function" == typeof d && (a.addEventListener("click", d), o.addEventListener("click", d)), s && "function" == typeof s && i.addEventListener("click", s), i.addEventListener("click", r.remove.bind(r)), a.addEventListener("click", r.remove.bind(r)), c.appendChild(i), c.appendChild(a), r.appendChild(c), r;
      }, prompt: function prompt(n) {
        var r = t(n),
            c = document.createElement("div"),
            i = document.createElement("button"),
            a = document.createElement("input"),
            o = r.querySelector(e.crossBtn),
            d = n.cancelHandler,
            s = n.okHandler;return c.classList.add(e.btnsWrapper), i.innerHTML = n.okText || "Ok", i.classList.add(e.btn), i.classList.add(e.okBtn), a.classList.add(e.input), n.placeholder && a.setAttribute("placeholder", n.placeholder), n.default && (a.value = n.default), n.inputType && (a.type = n.inputType), d && "function" == typeof d && o.addEventListener("click", d), s && "function" == typeof s && i.addEventListener("click", function () {
          s(a.value);
        }), i.addEventListener("click", r.remove.bind(r)), c.appendChild(a), c.appendChild(i), r.appendChild(c), r;
      }, wrapper: function wrapper() {
        var t = document.createElement("DIV");return t.classList.add(e.wrapper), t;
      } };
  }();
}, function (e, t) {}, function (e, t, n) {
  "use strict"; /*!
                * Codex JavaScript Notification module
                * https://github.com/codex-team/js-notifier
                *
                * Codex Team - https://ifmo.su
                *
                * MIT License | (c) Codex 2017
                */

  e.exports = function () {
    function e() {
      if (i) return !0;i = r.wrapper(), document.body.appendChild(i);
    }function t(t) {
      if (t.message) {
        e();var n = null,
            a = t.time || 8e3;switch (t.type) {case "confirm":
            n = r.confirm(t);break;case "prompt":
            n = r.prompt(t);break;default:
            n = r.alert(t), window.setTimeout(function () {
              n.remove();
            }, a);}i.appendChild(n), n.classList.add(c);
      }
    }n(1);var r = n(0),
        c = "cdx-notify--bounce-in",
        i = null;return { show: t };
  }();
}]);

/*** EXPORTS FROM exports-loader ***/
module.exports = notifier;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
* Require CSS build
*/
__webpack_require__(9);

var hawk = function (self) {
  'use strict';

  self.init = function () {
    /**
     * Event popup
     */
    self.eventPopup.init();

    self.eventAppender.init();

    console.log('Hawk app initialized');
  };

  self.checkbox = __webpack_require__(2);
  self.copyable = __webpack_require__(3);
  self.ajax = __webpack_require__(1);
  self.domain = __webpack_require__(4);
  self.notifier = __webpack_require__(8);
  self.event = __webpack_require__(7);
  self.eventPopup = __webpack_require__(6);
  self.eventAppender = __webpack_require__(5);

  return self;
}({});

hawk.docReady = function (f) {
  'use strict';

  return (/in/.test(document.readyState) ? window.setTimeout(hawk.docReady, 9, f) : f()
  );
};

module.exports = hawk;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map