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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyable module allows you to add text to copy buffer by click
 * Just add 'js-copyable' name to element
 *
 * @usage
 * <span name='js-copyable'>Click to copy</span>
 *
 * @type {{init}}
 */
module.exports = function () {

  var NAMES = {
    copyable: 'js-copyable'
  };

  /**
   * Take element by name and pass it to prepareElement function
   */
  var init = function init() {

    var elems = document.getElementsByName(NAMES.copyable);

    if (!elems) {

      console.log('There are no copyable elements');
      return;
    }

    for (var i = 0; i < elems.length; i++) {

      prepareElement(elems[i]);
    }

    console.log('Copyable module initialized');
  };

  /**
   * Add click listener to copyable element
   *
   * @param element
   */
  var prepareElement = function prepareElement(element) {

    element.addEventListener('click', elementClicked);
  };

  /**
   * Click handler
   * Create new range, select copyable element and add range to selection. Then exec 'copy' command
   *
   * @param e
   */
  var elementClicked = function elementClicked() {

    var selection = window.getSelection(),
        range = document.createRange();

    range.selectNode(this);
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand('copy');
    selection.removeAllRanges();
  };

  return {
    init: init
  };
}();

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
* Require CSS build
*/
__webpack_require__(2);

var hawk = function (self) {

  'use strict';

  self.init = function () {

    console.log('Initialized');
  };

  self.checkbox = __webpack_require__(0);
  self.copyable = __webpack_require__(1);

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