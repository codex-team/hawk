var hawkso =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 1 */
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (t, e) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "object" == ( false ? "undefined" : _typeof(module)) ? module.exports = e() :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (e),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports.ajax = e() : t.ajax = e();
}(undefined, function () {
  return function (t) {
    function e(r) {
      if (n[r]) return n[r].exports;var a = n[r] = { i: r, l: !1, exports: {} };return t[r].call(a.exports, a, a.exports, e), a.l = !0, a.exports;
    }var n = {};return e.m = t, e.c = n, e.d = function (t, n, r) {
      e.o(t, n) || Object.defineProperty(t, n, { configurable: !1, enumerable: !0, get: r });
    }, e.n = function (t) {
      var n = t && t.__esModule ? function () {
        return t.default;
      } : function () {
        return t;
      };return e.d(n, "a", n), n;
    }, e.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }, e.p = "", e(e.s = 0);
  }([function (t, e, n) {
    "use strict";
    t.exports = function () {
      var t = function t(_t) {
        return _t instanceof FormData;
      };return { call: function call(e) {
          if (e && e.url) {
            var n = window.XMLHttpRequest ? new window.XMLHttpRequest() : new window.ActiveXObject("Microsoft.XMLHTTP"),
                r = e.progress || null,
                a = e.success || function () {},
                o = e.error || function () {},
                u = e.before || null,
                i = e.after ? e.after.bind(null, e.data) : null;if (e.async = !0, e.type = e.type || "GET", e.data = e.data || "", e["content-type"] = e["content-type"] || "application/json; charset=utf-8", "GET" === e.type && e.data && (e.url = /\?/.test(e.url) ? e.url + "&" + e.data : e.url + "?" + e.data), e.withCredentials && (n.withCredentials = !0), u && "function" == typeof u) {
              if (!1 === u(e.data)) return;
            }if (n.open(e.type, e.url, e.async), !t(e.data)) {
              var c = new FormData();for (var f in e.data) {
                c.append(f, e.data[f]);
              }e.data = c;
            }r && "function" == typeof r && n.upload.addEventListener("progress", function (t) {
              var e = parseInt(t.loaded / t.total * 100);r(e);
            }, !1), n.setRequestHeader("X-Requested-With", "XMLHttpRequest"), n.onreadystatechange = function () {
              if (4 === n.readyState) {
                var t = n.responseText;try {
                  t = JSON.parse(t);
                } catch (t) {}200 === n.status ? a(t) : o(t), i && "function" == typeof i && i();
              }
            }, n.send(e.data);
          }
        } };
    }();
  }]);
});
//# sourceMappingURL=bundle.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)(module)))

/***/ }),
/* 3 */
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
/* 4 */
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
    copyable: 'js-copyable',
    authorized: 'js-copyable-authorize'
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

    var authorizedElems = document.getElementsByName(NAMES.authorized);

    for (var _i = 0; _i < elems.length; _i++) {
      authorize(authorizedElems[_i]);
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
   * Add click listner for authorized element
   *
   * @param element
   */
  var authorize = function authorize(element) {
    element.addEventListener('click', authorizedCopy);
  };

  /**
   * Click handler for authorized elements
   */
  var authorizedCopy = function authorizedCopy() {
    var authorizedElem = this;
    var copyable = authorizedElem.querySelector('[name=' + NAMES.copyable + ']');

    copyable.click();
  };

  /**
   * Click handler
   * Create new range, select copyable element and add range to selection. Then exec 'copy' command
   */
  var elementClicked = function elementClicked(event) {
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
    event.stopPropagation();
  };

  return {
    init: init
  };
}();

/***/ }),
/* 5 */
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

  var dom = __webpack_require__(1).default;

  /**
   * Module holder element
   * @type {null}
   */
  var wrapper = null;

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
   * @inner
   *
   * Remove event listeners if popup was closed
   *
   */
  var removeClosingButtonHandler = function removeClosingButtonHandler() {
    document.removeEventListener('click', self.close, false);
    document.removeEventListener('keydown', self.close, false);
    window.history.replaceState(null, '', eventsListURL);
  };

  /**
   * Removes class when clicked ESC
   */
  var closePopupByEscape_ = function closePopupByEscape_(event) {
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
    /** Remove loader */
    popup.holder.classList.remove(CSS.popupLoading);

    popup.content.insertAdjacentHTML('beforeEnd', response.traceback);
    updateHeaderTime(response.event ? response.event.time : 0);

    /** initialize modules inside html response */
    hawkso.initInternalModules(popup.holder);
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
    event.count = event.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    popup.content.insertAdjacentHTML('afterbegin', '<div class="event">\n      <div class="event__header">\n        <span class="event__project">' + projectName + '</span>\n        <span class="event__type event__type--' + event.tag + '">\n          ' + (event.tag === 'javascript' ? 'JavaScript Error' : event.tag) + '\n        </span>\n      </div>\n      <div class="event__content clearfix">\n        <div class="event__counter">\n          <div class="event__counter-number">\n            <div class="event__counter-number--digit">' + event.count + '</div>\n            times\n          </div>\n          <div class="event__counter-date">\n            <div class="event__placeholder"></div>\n            <div class="event__placeholder"></div>\n          </div>\n        </div>\n        <div class="event__title">\n          ' + event.message + '\n        </div>\n        <div class="event__path">\n          ' + event.errorLocation.full + '\n        </div>\n      </div>\n    </div>');
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
  var sendPopupRequest_ = function sendPopupRequest_(event, eventUrl) {
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

    hawkso.ajax.call({
      url: eventUrl + '?popup=true',
      method: 'GET',
      success: handleSuccessResponse_,
      error: function error(err) {
        hawkso.notifier.show({ style: 'error', message: 'Cannot load event data' });
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
    wrapper = this;

    popup = makePopup();

    document.body.appendChild(popup.holder);

    /**
     * Handle clicks on rows
     */
    eventRows = wrapper.querySelectorAll('.' + CSS.eventRow);
    bindRowsClickHandler(eventRows);

    /** Close popup by Back/Forward navigation */
    window.onpopstate = function (e) {
      if (!e.state || !e.state.popupOpened) {
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
    eventRows = wrapper.querySelectorAll('.' + CSS.eventRow);
    bindRowsClickHandler(eventRows);
  };

  return self;
}({});

module.exports = eventPopup;

/***/ }),
/* 6 */
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

    /**
     * Close prevoiusly opened rows
     */
    var previouslyOpenedRows = document.querySelectorAll('.event-info--opened'),
        previouslyOpenedStacks = document.querySelectorAll('.event-info');

    previouslyOpenedRows.forEach(function (row) {
      return row.classList.remove('event-info--opened');
    });
    previouslyOpenedStacks.forEach(function (stack) {
      return stack.classList.add('hide');
    });

    eventInfo.classList.toggle('hide');
    stackButton.classList.toggle('event-info--opened');

    eventInfo.scrollIntoView();
  };

  return {
    toggleStack: toggleStack
  };
}();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * This module allows add event listeners for keyboard keys.
 *
 * @examples
 * element.addEventListener('enter', myEnterHandler);
 * element.addEventListener('space', mySpaceHandler);
 * element.addEventListener('keyc', myCKeyHandler);
 *
 * CustomEvent will be passed to your handler with original event in detail property
 *
 * function myEnterHandler (customEvent) {
 *    console.log('Here is original keyDown event: ', customEvent.detail);
 * }
 *
 * Or you can just add 'on' + keyName attribute to element like onclick or onkeydown
 * @example
 * <input onenter="console.log('You press enter on: ', this); console.log('Here is event: ', event);">
 *
 * @type {{init}}
 */
module.exports = function () {
  var init = function init() {
    window.addEventListener('keydown', keyDownHandler);
  };

  var keyDownHandler = function keyDownHandler(event) {
    var eventType = event.code.toLowerCase(),
        target = event.target;

    if (target.hasAttribute('on' + eventType)) {
      try {
        evalAttributeCode.call(target, event);
      } catch (e) {
        console.log('Error while eval %o on%s code: %o', target, eventType, e);
      }
    }

    var customEvent = new CustomEvent(eventType, {
      detail: event,
      bubbles: true
    });

    target.dispatchEvent(customEvent);
  };

  var evalAttributeCode = function evalAttributeCode(event) {
    eval(this.getAttribute('on' + event.key.toLowerCase()));
  };

  return {
    init: init
  };
}();

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _class = __webpack_require__(15);

module.exports = function (self) {
  self.init = function (settings) {
    var el = this;

    new _class.Appender({
      url: settings.url,
      init: function init(loadMoreButton) {
        el.insertAdjacentElement('afterEnd', loadMoreButton);
      },
      appendItemsOnLoad: function appendItemsOnLoad(items) {
        if (items.traceback.trim()) {
          el.insertAdjacentHTML('beforeEnd', items.traceback);
        }
        if (settings.onLoadItems) {
          try {
            eval(settings.onLoadItems);
          } catch (e) {
            console.log('Can\'t fire onLoadItems functions because of %o', e);
          }
        }
      },
      onError: function onError() {
        hawkso.notifier.show({
          message: 'Can\'t load data. Please try again later',
          style: 'error'
        });
      }
    });
  };

  return self;
}({}); /**
        * @module Module Appender
        *
        * Creates instances to required modules
        * Can be customized
        *
        * Appends after element generates by class "load more button"
        */

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * CodeX Transport
 * AJAX file-uploading module
 * @see {@link https://github.com/codex-team/transport}
 * @copyright  CodeX <team@ifmo.su>
 */
var transport = __webpack_require__(14);

/**
 * Work with projects settings files
 */
module.exports = function () {
  /**
   * Methods for uploading logo
   * @type {{clicked(), uploading(), success(), error()}}
   */
  var logoUploader = {

    /**
     * Logo Wrapper
     */
    holder: null,

    /**
     * Show file selection window and upload the file
     *
     * @this {Element} Project logo wrapper
     */
    clicked: function clicked() {
      logoUploader.holder = this;

      var projectId = logoUploader.holder.dataset.projectId,
          _csrf = logoUploader.holder.dataset.csrf;

      transport.init({
        url: 'settings/loadIcon',
        multiple: false,
        accept: 'image/*',
        data: {
          projectId: projectId,
          _csrf: _csrf
        },
        before: logoUploader.uploading.start,
        success: logoUploader.success,
        error: logoUploader.error
      });
    },


    /**
     * Loading indicator
     */
    uploading: {

      /**
       * Loading animation class name
       * @type {string}
       */
      className: 'project__logo-wrapper--loading',

      /**
       * Show loader
       */
      start: function start() {
        logoUploader.holder.classList.add(logoUploader.uploading.className);
      },

      /**
       * Hide loader
       */
      stop: function stop() {
        logoUploader.holder.classList.remove(logoUploader.uploading.className);
      }
    },

    /**
     * Uploading succeeded
     * @param {object} response
     * @param {string} response.message - error message
     * @param {string} response.logoUrl - uploaded logo URL
     * @param {number} response.status  - response code
     */
    success: function success(response) {
      if (response.status !== 200) {
        logoUploader.error(response);
        return;
      }

      /**
       * Find or create an image
       */
      var img = logoUploader.holder.querySelector('img');

      if (!img) {
        img = document.createElement('img');
        logoUploader.holder.appendChild(img);
      }

      /**
       * Update image source
       */
      img.src = response.logoUrl + '/crop/200';
      img.addEventListener('load', function () {
        logoUploader.uploading.stop();
      });
    },


    /**
     * Uploading failed
     * @param {object} response
     * @param {string} response.message - error message
     * @param {number} response.status    - response code
     */
    error: function error() {
      var response = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      console.log('Project upload error ', response);

      hawkso.notifier.show({
        message: response.message || 'Uploading failed. Try another file.',
        style: 'error'
      });

      logoUploader.uploading.stop();
    }
  };

  /**
   * Init all projects elements
   */
  var init = function init() {
    /**
     * Activate project logo uploading
     */
    var logoHolders = document.querySelectorAll('.js_project_logo');

    if (logoHolders) {
      for (var i = logoHolders.length - 1; i >= 0; i--) {
        logoHolders[i].addEventListener('click', logoUploader.clicked, false);
      }
    }
  };

  return {
    init: init
  };
}();

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module for checking settings form before sending
 */

module.exports = function () {
  var IDS = {
    password: 'password',
    repeatedPassword: 'repeatedPassword'
  };

  /** Array for catched errors */
  var errors = {};

  var init = function init() {
    console.log('SettingsForm module initialized');
  };

  /**
   * Runs tests for validity
   */
  var checkForm = function checkForm(event) {
    /** Reset errors array */
    errors = {};

    /** Tests */
    checkPassword();
    /** */

    /** if tests were failed */
    if (Object.keys(errors).length) {
      for (var error in errors) {
        hawkso.notifier.show({
          message: errors[error],
          style: 'error'
        });
      }

      /** Prevent form sending */
      event.preventDefault();
    }
  };

  /**
   * Check passwords fields
   */
  var checkPassword = function checkPassword() {
    var password = document.getElementById(IDS.password),
        repeatedPassword = document.getElementById(IDS.repeatedPassword);

    if (password.value != repeatedPassword.value) {
      errors['repeatedPassword'] = 'Passwords don\'t match.';
    }
  };

  /**
   * Send request to invite new member to the project
   *
   * @param projectId
   * @param form
   */
  var inviteMember = function inviteMember(projectId, form) {
    var input = document.getElementById(projectId);

    if (!input) return;

    var email = input.value;

    hawkso.ajax.call({
      type: 'POST',
      url: '/garage/project/inviteMember',
      success: function success(result) {
        hawkso.notifier.show({
          style: result.success ? 'success' : 'error',
          message: result.message
        });
        if (result.success) {
          hawkso.toggler.toggle(form);
          input.value = '';
        }
      },
      error: function error() {
        hawkso.notifier.show({
          style: 'error',
          message: 'Something went wrong. Try again later.'
        });
      },
      data: JSON.stringify({
        email: email,
        projectId: projectId
      })
    });
  };

  /**
   * Send request to save notifications preferences for the project
   *
   * @param checkbox
   * @param projectId
   * @param userId
   */
  var saveNotifiesPreferences = function saveNotifiesPreferences(checkbox, projectId, userId) {
    var input = checkbox.querySelector('input'),
        value = !input.checked,
        type = checkbox.dataset.name;

    hawkso.ajax.call({
      type: 'POST',
      url: '/garage/project/editNotifies',
      error: function error() {
        hawkso.notifier.show({
          style: 'error',
          message: 'Can\'t save notifications preferences. Try again later'
        });
      },
      success: function success(result) {
        hawkso.notifier.show({
          style: result.success ? 'success' : 'error',
          message: result.message
        });
      },
      data: JSON.stringify({
        projectId: projectId,
        userId: userId,
        type: type,
        value: value
      })
    });
  };

  /**
   * Send request to save notifications webhook
   *
   * @param projectId
   * @param userId
   * @param type
   */
  var saveWebhook = function saveWebhook(projectId, userId, type) {
    var input = document.getElementById(type + '-' + projectId),
        value = input.value;

    hawkso.ajax.call({
      type: 'POST',
      url: '/garage/project/saveWebhook',
      error: function error() {
        hawkso.notifier.show({
          style: 'error',
          message: 'Can\'t save webhook. Try again later'
        });
      },
      success: function success(result) {
        hawkso.notifier.show({
          style: result.success ? 'success' : 'error',
          message: result.message
        });
      },
      data: JSON.stringify({
        projectId: projectId,
        userId: userId,
        type: type,
        value: value
      })
    });
  };

  /**
   * Send request to grant admin access to user
   *
   * @param projectId
   * @param userId
   * @param button
   */
  var grantAdminAccess = function grantAdminAccess(projectId, userId, button) {
    hawkso.ajax.call({
      type: 'POST',
      url: '/garage/project/grantAdminAccess',
      error: function error() {
        hawkso.notifier.show({
          style: 'error',
          message: 'Can\'t grant access. Try again later'
        });
      },
      success: function success(result) {
        hawkso.notifier.show({
          style: result.success ? 'success' : 'error',
          message: result.message
        });
        if (result.success) {
          button.classList.add('project__member-role--admin');
          button.classList.remove('project__member-role--member');
          button.textContent = 'Admin';
        }
      },
      data: JSON.stringify({
        projectId: projectId,
        userId: userId
      })
    });
  };

  var resendInvitation = function resendInvitation(projectId, userId, button) {
    hawkso.ajax.call({
      type: 'POST',
      url: '/garage/project/resendInvitation',
      data: {
        projectId: projectId,
        userId: userId
      },
      error: function error() {
        hawkso.notifier.show({
          style: 'error',
          message: 'Can not resend the invitation. Try again later'
        });
      },
      success: function success(result) {
        hawkso.notifier.show({
          style: result.success ? 'success' : 'error',
          message: result.message
        });
        if (result.success) {
          // button.classList.add('project__member-role--admin');
          // button.classList.remove('project__member-role--member');
          // button.textContent = 'Admin';
        }
      }
    });
  };

  return {
    init: init,
    checkForm: checkForm,
    inviteMember: inviteMember,
    saveNotifiesPreferences: saveNotifiesPreferences,
    saveWebhook: saveWebhook,
    grantAdminAccess: grantAdminAccess,
    resendInvitation: resendInvitation
  };
}();

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Toggler module allows you toggle element display property by trigger element
 * Add name 'js-toggle' and data-button attribute that consist id of trigger element
 * After click on trigger element it will hide
 *
 * @example
 * <button id="myButton">Show label</button>
 * <label name="js-toggle" data-button="myButton">This is label</button>
 *
 * @type {{init, toggle}}
 */
module.exports = function () {
  var NAME = 'js-toggle';
  var HIDE_CLASS = 'hide';

  var elements = {};

  /**
   * Get all elements with 'js-toggle' name and prepare them
   */
  var init = function init() {
    var elems = document.getElementsByName(NAME);

    for (var i = 0; i < elems.length; i++) {
      prepareElem(elems[i]);
    }
  };

  /**
   * Get toggle buttons and save them and add click listeners
   *
   * @param elem
   */
  var prepareElem = function prepareElem(elem) {
    var buttonId = elem.dataset.button,
        button = document.getElementById(buttonId);

    elem.classList.add(HIDE_CLASS);
    elements[buttonId] = elem;

    button.addEventListener('click', buttonClicked);
  };

  /**
   * Toggle button click handler
   */
  var buttonClicked = function buttonClicked() {
    var button = this,
        buttonId = button.id;

    button.classList.add(HIDE_CLASS);
    elements[buttonId].classList.remove(HIDE_CLASS);
  };

  /**
   * Toggle element display property
   *
   * @param elem
   * @param elem.dataset.button — id of trigger element
   */
  var toggle = function toggle(elem) {
    var buttonId = elem.dataset.button,
        button = document.getElementById(buttonId);

    button.classList.toggle(HIDE_CLASS);

    if (button.classList.contains(HIDE_CLASS)) {
      elem.classList.remove(HIDE_CLASS);
    } else {
      elem.classList.add(HIDE_CLASS);
    }
  };

  return {
    init: init,
    toggle: toggle
  };
}();

/***/ }),
/* 12 */
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
/* 13 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (t, e) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "object" == ( false ? "undefined" : _typeof(module)) ? module.exports = e() :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (e),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports.transport = e() : t.transport = e();
}(undefined, function () {
  return function (t) {
    function e(r) {
      if (n[r]) return n[r].exports;var o = n[r] = { i: r, l: !1, exports: {} };return t[r].call(o.exports, o, o.exports, e), o.l = !0, o.exports;
    }var n = {};return e.m = t, e.c = n, e.d = function (t, n, r) {
      e.o(t, n) || Object.defineProperty(t, n, { configurable: !1, enumerable: !0, get: r });
    }, e.n = function (t) {
      var n = t && t.__esModule ? function () {
        return t.default;
      } : function () {
        return t;
      };return e.d(n, "a", n), n;
    }, e.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }, e.p = "", e(e.s = 0);
  }([function (t, e, n) {
    "use strict";
    var r = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
      return typeof t === "undefined" ? "undefined" : _typeof(t);
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t === "undefined" ? "undefined" : _typeof(t);
    },
        o = n(1);t.exports = function (t) {
      var e = null;t.input = null;var n = function n() {
        t.input.click();
      },
          u = function u() {
        e.before(t.input.files);
      },
          a = function a() {
        var n = e.url,
            a = e.data,
            i = u,
            c = e.progress,
            f = e.success,
            s = e.error,
            p = e.after,
            l = new FormData(),
            d = t.input.files;if (d.length > 1) for (var y = 0; y < d.length; y++) {
          l.append("files[]", d[y], d[y].name);
        } else l.append("file", d[0], d[0].name);if (null !== a && "object" === (void 0 === a ? "undefined" : r(a))) for (var b in a) {
          l.append(b, a[b]);
        }o.call({ type: "POST", data: l, url: n, before: i, progress: c, success: f, error: s, after: p });
      };return t.init = function (r) {
        if (!r.url) return void console.log("Can't send request because `url` is missed");e = r;var o = document.createElement("INPUT");o.type = "file", e && e.multiple && o.setAttribute("multiple", "multiple"), e && e.accept && o.setAttribute("accept", e.accept), o.addEventListener("change", a, !1), t.input = o, n();
      }, t;
    }({});
  }, function (t, e, n) {
    !function (e, n) {
      t.exports = n();
    }(0, function () {
      return function (t) {
        function e(r) {
          if (n[r]) return n[r].exports;var o = n[r] = { i: r, l: !1, exports: {} };return t[r].call(o.exports, o, o.exports, e), o.l = !0, o.exports;
        }var n = {};return e.m = t, e.c = n, e.d = function (t, n, r) {
          e.o(t, n) || Object.defineProperty(t, n, { configurable: !1, enumerable: !0, get: r });
        }, e.n = function (t) {
          var n = t && t.__esModule ? function () {
            return t.default;
          } : function () {
            return t;
          };return e.d(n, "a", n), n;
        }, e.o = function (t, e) {
          return Object.prototype.hasOwnProperty.call(t, e);
        }, e.p = "", e(e.s = 0);
      }([function (t, e, n) {
        "use strict";
        t.exports = function () {
          var t = function t(_t) {
            return _t instanceof FormData;
          };return { call: function call(e) {
              if (e && e.url) {
                var n = window.XMLHttpRequest ? new window.XMLHttpRequest() : new window.ActiveXObject("Microsoft.XMLHTTP"),
                    r = e.progress || null,
                    o = e.success || function () {},
                    u = e.error || function () {},
                    a = e.before || null,
                    i = e.after ? e.after.bind(null, e.data) : null;if (e.async = !0, e.type = e.type || "GET", e.data = e.data || "", e["content-type"] = e["content-type"] || "application/json; charset=utf-8", "GET" === e.type && e.data && (e.url = /\?/.test(e.url) ? e.url + "&" + e.data : e.url + "?" + e.data), e.withCredentials && (n.withCredentials = !0), a && "function" == typeof a && !1 === a(e.data)) return;if (n.open(e.type, e.url, e.async), !t(e.data)) {
                  var c = new FormData();for (var f in e.data) {
                    c.append(f, e.data[f]);
                  }e.data = c;
                }r && "function" == typeof r && n.upload.addEventListener("progress", function (t) {
                  var e = parseInt(t.loaded / t.total * 100);r(e);
                }, !1), n.setRequestHeader("X-Requested-With", "XMLHttpRequest"), n.onreadystatechange = function () {
                  if (4 === n.readyState) {
                    var t = n.responseText;try {
                      t = JSON.parse(t);
                    } catch (t) {}200 === n.status ? o(t) : u(t), i && "function" == typeof i && i();
                  }
                }, n.send(e.data);
              }
            } };
        }();
      }]);
    });
  }]);
});
//# sourceMappingURL=bundle.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)(module)))

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dom = __webpack_require__(1).default;

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

var Appender = exports.Appender = function () {
  /**
   * Class internal properties:
   * @property {Object} settings - comes outsite
   * @property {Boolean} autoload - load data by scroll
   * @property {Number} nextPage - page rotation
   * @property {Object} CSS - styles
   */
  function Appender(settings) {
    _classCallCheck(this, Appender);

    this.settings = settings;
    this.nextPage = 2;
    this.allowedAutoloading = false;

    this.CSS = {
      loadMoreButton: 'eventAppender__loadMoreButton'
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
  }

  _createClass(Appender, [{
    key: 'drawLoadMoreButton',


    /**
     * Draws load more button
     */
    value: function drawLoadMoreButton() {
      var block = dom.make('DIV', this.CSS.loadMoreButton, {
        textContent: 'Load more'
      });

      return block;
    }
  }, {
    key: 'loadByScroll',


    /**
     * load data by scroll
     */
    value: function loadByScroll() {
      if (!this.allowedAutoloading) {
        return;
      }
    }

    /**
     * Sends a request to the server
     * After getting response calls {settings.appendItemsOnLoad} Function
     */

  }, {
    key: 'loadMoreEvents',
    value: function loadMoreEvents(event) {
      event.preventDefault();

      hawkso.ajax.call({
        url: this.settings.url + this.nextPage,
        beforeSend: this.beforeSend.bind(this),
        success: this.successCallback.bind(this),
        error: this.errorCallback.bind(this)
      });

      this.loadByScroll();
    }
  }, {
    key: 'beforeSend',


    /**
     * Append spinner
     */
    value: function beforeSend() {
      this.loadMoreButton.classList.add('spinner');
    }

    /**
     * remove "load more button" if server says "can't load more"
     * call Customized callback with response
     */

  }, {
    key: 'successCallback',
    value: function successCallback(response) {
      this.loadMoreButton.classList.remove('spinner');
      if (!response.canLoadMore) {
        this.loadMoreButton.remove();
      }

      this.nextPage++;
      this.settings.appendItemsOnLoad(response);
    }
  }, {
    key: 'errorCallback',


    /**
     * Handle error responses
     */
    value: function errorCallback(error) {
      if (error) {
        this.settings.onError(error);
      }
    }
  }]);

  return Appender;
}();

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Require CSS build
 */
__webpack_require__(13);

var hawkso = function (self) {
  'use strict';

  self.init = function () {
    delegate();

    /** Settings-form checker for validity */
    self.settingsForm.init();

    /** Custom keyboard events **/

    self.keyboard.init();

    console.log('Hawk app initialized');
  };

  self.checkbox = __webpack_require__(3);
  self.copyable = __webpack_require__(4);
  self.ajax = __webpack_require__(2);
  self.notifier = __webpack_require__(12);
  self.event = __webpack_require__(6);
  self.eventPopup = __webpack_require__(5);
  self.appender = __webpack_require__(8);
  self.settingsForm = __webpack_require__(10);
  self.toggler = __webpack_require__(11);
  self.keyboard = __webpack_require__(7);
  self.projectSettings = __webpack_require__(9);

  var delegate = function delegate(element) {
    var modulesRequired = void 0;

    if (element) {
      modulesRequired = element.querySelectorAll('[data-module-required]');
    } else {
      modulesRequired = document.querySelectorAll('[data-module-required]');
    }

    for (var i = 0; i < modulesRequired.length; i++) {
      initModule(modulesRequired[i]);
    }
  };

  self.initInternalModules = function (element) {
    delegate(element);
  };

  /**
   * get's module name from data attributes
   * Calls module with settings that are defined below on <module-settings> tag
   */
  function initModule(foundRequiredModule) {
    var moduleName = foundRequiredModule.dataset.moduleRequired,
        moduleSettings = void 0;

    if (self[moduleName]) {
      moduleSettings = foundRequiredModule.querySelector('module-settings');

      if (moduleSettings) {
        moduleSettings = moduleSettings.textContent.trim();
      }

      if (self[moduleName].init) {
        var parsedSettings = JSON.parse(moduleSettings);

        self[moduleName].init.call(foundRequiredModule, parsedSettings);
      }
    }
  }

  return self;
}({});

hawkso.docReady = function (f) {
  'use strict';

  return (/in/.test(document.readyState) ? window.setTimeout(hawkso.docReady, 9, f) : f()
  );
};

module.exports = hawkso;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map