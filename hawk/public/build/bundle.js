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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
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
/* 2 */
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
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
var vsprintf = __webpack_require__(7).vsprintf;

var tracebackPopup = function (self) {
  var keyCodes_ = {
    ESC: 27
  };

  /**
   * @inner
   * List of element classes that needs to find
   */
  var elements_ = {
    eventItems: 'garage-list-item',
    eventItemTitle: 'garage-list-item__title',
    tracebackPopup: 'traceback-popup',
    tracebackContent: 'traceback-popup__content',
    tracebackClosingButton: 'traceback-popup__closing-button'
  };

  /**
   * @inner
   * List of CSS styles
   */
  var styles_ = {
    showTracebackPopup: 'traceback-popup--show',
    popupContentHovered: 'traceback-popup--hovered'
  };

  /**
   * event items
   * @inner
   * @type {Array} - list of found event items
   */
  var eventItems = null;

  /**
   * traceback popup wrapper
   * @inner
   * @type {Element} - popups holder
   */
  var tracebackPopup = null;

  /**
   * popup's content
   * @inner
   * @type {Element} - popups content
   */
  var tracebackContent = null;

  /**
   * popup's closing button
   * @inner
   * @type {Element} - cross button that closes whole popup
   */
  var tracebackClosingButton = null;

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
    for (var i = 0; i < eventItems.length; i++) {
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
  var closePopupByEscape_ = function closePopupByEscape_(event) {
    switch (event.keyCode) {
      case keyCodes_.ESC:
        tracebackPopup.classList.remove(styles_.showTracebackPopup);
        break;
    }
  };

  /**
   * Removes class that display's popup when clicked outsite of popup's content
   */
  var closePopupByOutsideClick_ = function closePopupByOutsideClick_(event) {
    var target = event.target,
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
  var tracebackContentHovered_ = function tracebackContentHovered_(event) {
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
  var addClosingButtonHandler_ = function addClosingButtonHandler_() {
    tracebackClosingButton.addEventListener('click', self.close, false);
  };

  /**
   * @inner
   *
   * insert as inner html requested traceback. Response must be rendered template
   */
  var handleSuccessResponse_ = function handleSuccessResponse_(response) {
    tracebackContent.insertAdjacentHTML('beforeEnd', response);
    self.open();
  };

  /**
   * @inner
   *
   * Handle cases when something gone wrong
   */
  var handleErrorResponse_ = function handleErrorResponse_(response) {};

  /**
   * @inner
   *
   * delegate and add event listeners to the items
   * prevent clicks on items and show popup via traceback content
   *
   * @param {Array} items - found elemens. Delegates elements that found in Initialization proccess
   */
  var addItemHandlerOnClick_ = function addItemHandlerOnClick_(items) {
    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener('click', sendPopupRequest_, false);
    }
  };

  /**
   * @inner
   *
   * send ajax request and delegate to handleSuccessResponse_ on success response
   */
  var sendPopupRequest_ = function sendPopupRequest_(event) {
    event.preventDefault();

    var tracebackHeader = makeTracebackEventHeader_.call(this);

    tracebackContent.innerHTML = tracebackHeader;

    var that = this,
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
  var makeTracebackEventHeader_ = function makeTracebackEventHeader_() {
    var domain = document.querySelector('.garage-header__page-title'),
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
    var fragment = document.createDocumentFragment();
    var el = '<div class="event">\n      <div class="event__header">\n        <span class="event__domain">%s</span>\n        <span class="event__type event__type--javascript">\n          %s\n        </span>\n      </div>\n      <div class="event__content clearfix">\n        <div class="event__counter">\n          <div class="event__counter-number">\n            <div class="event__counter-number--digit">%s</div>\n            times\n          </div>\n          <div class="event__counter-date">since<br>23-06-2017</div>\n        </div>\n        <div class="event__title">\n          %s\n        </div>\n        <div class="event__path">\n          %s\n        </div>\n      </div>\n    </div>';

    el = vsprintf(el, [domain, errorTag, errorCounter, errorTitle, errorCaption]);
    fragment.innerHTML = el;

    return fragment.innerHTML;
  };

  return self;
}({});

module.exports = tracebackPopup;

/***/ }),
/* 5 */
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
/* 6 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

/* global window, exports, define */

!function () {
    'use strict';

    var re = {
        not_string: /[^s]/,
        not_bool: /[^t]/,
        not_type: /[^T]/,
        not_primitive: /[^v]/,
        number: /[diefg]/,
        numeric_arg: /[bcdiefguxX]/,
        json: /[j]/,
        not_json: /[^j]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[\+\-]/
    };

    function sprintf(key) {
        // `arguments` is not an array, but should be fine for this call
        return sprintf_format(sprintf_parse(key), arguments);
    }

    function vsprintf(fmt, argv) {
        return sprintf.apply(null, [fmt].concat(argv || []));
    }

    function sprintf_format(parse_tree, argv) {
        var cursor = 1,
            tree_length = parse_tree.length,
            arg,
            output = '',
            i,
            k,
            match,
            pad,
            pad_character,
            pad_length,
            is_positive,
            sign;
        for (i = 0; i < tree_length; i++) {
            if (typeof parse_tree[i] === 'string') {
                output += parse_tree[i];
            } else if (Array.isArray(parse_tree[i])) {
                match = parse_tree[i]; // convenience purposes only
                if (match[2]) {
                    // keyword argument
                    arg = argv[cursor];
                    for (k = 0; k < match[2].length; k++) {
                        if (!arg.hasOwnProperty(match[2][k])) {
                            throw new Error(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
                        }
                        arg = arg[match[2][k]];
                    }
                } else if (match[1]) {
                    // positional argument (explicit)
                    arg = argv[match[1]];
                } else {
                    // positional argument (implicit)
                    arg = argv[cursor++];
                }

                if (re.not_type.test(match[8]) && re.not_primitive.test(match[8]) && arg instanceof Function) {
                    arg = arg();
                }

                if (re.numeric_arg.test(match[8]) && typeof arg !== 'number' && isNaN(arg)) {
                    throw new TypeError(sprintf('[sprintf] expecting number but found %T', arg));
                }

                if (re.number.test(match[8])) {
                    is_positive = arg >= 0;
                }

                switch (match[8]) {
                    case 'b':
                        arg = parseInt(arg, 10).toString(2);
                        break;
                    case 'c':
                        arg = String.fromCharCode(parseInt(arg, 10));
                        break;
                    case 'd':
                    case 'i':
                        arg = parseInt(arg, 10);
                        break;
                    case 'j':
                        arg = JSON.stringify(arg, null, match[6] ? parseInt(match[6]) : 0);
                        break;
                    case 'e':
                        arg = match[7] ? parseFloat(arg).toExponential(match[7]) : parseFloat(arg).toExponential();
                        break;
                    case 'f':
                        arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg);
                        break;
                    case 'g':
                        arg = match[7] ? String(Number(arg.toPrecision(match[7]))) : parseFloat(arg);
                        break;
                    case 'o':
                        arg = (parseInt(arg, 10) >>> 0).toString(8);
                        break;
                    case 's':
                        arg = String(arg);
                        arg = match[7] ? arg.substring(0, match[7]) : arg;
                        break;
                    case 't':
                        arg = String(!!arg);
                        arg = match[7] ? arg.substring(0, match[7]) : arg;
                        break;
                    case 'T':
                        arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
                        arg = match[7] ? arg.substring(0, match[7]) : arg;
                        break;
                    case 'u':
                        arg = parseInt(arg, 10) >>> 0;
                        break;
                    case 'v':
                        arg = arg.valueOf();
                        arg = match[7] ? arg.substring(0, match[7]) : arg;
                        break;
                    case 'x':
                        arg = (parseInt(arg, 10) >>> 0).toString(16);
                        break;
                    case 'X':
                        arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase();
                        break;
                }
                if (re.json.test(match[8])) {
                    output += arg;
                } else {
                    if (re.number.test(match[8]) && (!is_positive || match[3])) {
                        sign = is_positive ? '+' : '-';
                        arg = arg.toString().replace(re.sign, '');
                    } else {
                        sign = '';
                    }
                    pad_character = match[4] ? match[4] === '0' ? '0' : match[4].charAt(1) : ' ';
                    pad_length = match[6] - (sign + arg).length;
                    pad = match[6] ? pad_length > 0 ? pad_character.repeat(pad_length) : '' : '';
                    output += match[5] ? sign + arg + pad : pad_character === '0' ? sign + pad + arg : pad + sign + arg;
                }
            }
        }
        return output;
    }

    var sprintf_cache = Object.create(null);

    function sprintf_parse(fmt) {
        if (sprintf_cache[fmt]) {
            return sprintf_cache[fmt];
        }

        var _fmt = fmt,
            match,
            parse_tree = [],
            arg_names = 0;
        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
                parse_tree.push(match[0]);
            } else if ((match = re.modulo.exec(_fmt)) !== null) {
                parse_tree.push('%');
            } else if ((match = re.placeholder.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1;
                    var field_list = [],
                        replacement_field = match[2],
                        field_match = [];
                    if ((field_match = re.key.exec(replacement_field)) !== null) {
                        field_list.push(field_match[1]);
                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1]);
                            } else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1]);
                            } else {
                                throw new SyntaxError('[sprintf] failed to parse named argument key');
                            }
                        }
                    } else {
                        throw new SyntaxError('[sprintf] failed to parse named argument key');
                    }
                    match[2] = field_list;
                } else {
                    arg_names |= 2;
                }
                if (arg_names === 3) {
                    throw new Error('[sprintf] mixing positional and named placeholders is not (yet) supported');
                }
                parse_tree.push(match);
            } else {
                throw new SyntaxError('[sprintf] unexpected placeholder');
            }
            _fmt = _fmt.substring(match[0].length);
        }
        return sprintf_cache[fmt] = parse_tree;
    }

    /**
     * export to either browser or node.js
     */
    /* eslint-disable quote-props */
    if (true) {
        exports['sprintf'] = sprintf;
        exports['vsprintf'] = vsprintf;
    }
    if (typeof window !== 'undefined') {
        window['sprintf'] = sprintf;
        window['vsprintf'] = vsprintf;

        if (true) {
            !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
                return {
                    'sprintf': sprintf,
                    'vsprintf': vsprintf
                };
            }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        }
    }
    /* eslint-enable quote-props */
}();

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
* Require CSS build
*/
__webpack_require__(6);

var hawk = function (self) {
  'use strict';

  self.init = function () {
    self.tracebackPopup.init();

    console.log('Initialized');
  };

  self.checkbox = __webpack_require__(1);
  self.copyable = __webpack_require__(2);
  self.ajax = __webpack_require__(0);
  self.domain = __webpack_require__(3);
  self.notifier = __webpack_require__(5);
  self.tracebackPopup = __webpack_require__(4);

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