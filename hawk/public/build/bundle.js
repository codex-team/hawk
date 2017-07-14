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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
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
/* 5 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
* Require CSS build
*/
__webpack_require__(5);

var hawk = function (self) {

  'use strict';

  self.init = function () {

    self.popup.init();
    console.log('Initialized');
  };

  self.checkbox = __webpack_require__(1);
  self.copyable = __webpack_require__(2);
  self.ajax = __webpack_require__(0);
  self.domain = __webpack_require__(3);
  self.notifier = __webpack_require__(4);
  self.popup = __webpack_require__(9);

  return self;
}({});

hawk.docReady = function (f) {

  'use strict';

  return (/in/.test(document.readyState) ? window.setTimeout(hawk.docReady, 9, f) : f()
  );
};

module.exports = hawk;

/***/ }),
/* 7 */,
/* 8 */,
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var popup = function (self) {

  /**
   * List of element classes that needs to find
   */
  var elements_ = {
    eventItems: 'garage-list-item',
    eventItemTitle: 'garage-list-item__title',
    tracebackPopup: 'traceback-popup',
    tracebackContent: 'traceback-popup__content',
    tracebackClosingButton: 'traceback-popup__closing-button'
  };

  var styles_ = {
    showTracebackPopup: 'traceback-popup--show'
  };

  /**
   * event items
   */
  var errorItems = null;

  /**
   * traceback popup wrapper
   */
  var tracebackPopup = null;

  /**
   * popup's content
   */
  var tracebackContent = null;

  /**
   * popup's closing button
   */
  var tracebackClosingButton = null;

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
  var addClosingButtonHandler_ = function addClosingButtonHandler_() {

    tracebackClosingButton.addEventListener('click', function () {

      self.close();
    }, false);
  };

  var sendPopupRequest_ = function sendPopupRequest_(event) {

    // event.preventDefault();

    console.log('her');
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

  var handleSuccessResponse_ = function handleSuccessResponse_(response) {

    tracebackContent.innerHTML = response;
    self.open();
  };

  var handleErrorResponse_ = function handleErrorResponse_(response) {};

  /**
   * @private
   *
   * delegate and add event listeners to the items
   * prevent clicks on items and show popup via traceback content
   *
   * @param {Object} items - found elemens
   */
  var addItemHandlerOnClick_ = function addItemHandlerOnClick_(items) {

    for (var i = 0; i < items.length; i++) {

      items[i].addEventListener('click', sendPopupRequest_, false);
    }
  };

  return self;
}({});

module.exports = popup;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map