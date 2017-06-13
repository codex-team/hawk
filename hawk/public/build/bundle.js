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


module.exports = function () {

    var init = function init() {

        var checkboxes = document.querySelectorAll('.form__checkbox');

        if (!checkboxes) {
            console.log('There are no checkboxes on page');
            return;
        }

        Array.prototype.forEach.call(checkboxes, prepareElements);

        console.log('Checkboxes initialized');
    };

    var prepareElements = function prepareElements(checkbox) {

        var input = document.createElement('input');

        input.type = 'checkbox';
        input.classList.add('js-checkbox');

        input.name = checkbox.dataset.name;
        input.value = checkbox.dataset.value;

        if (checkbox.dataset.checked) {
            input.checked = true;
        }

        checkbox.appendChild(input);
        checkbox.addEventListener('click', checkboxClicked);
    };

    var checkboxClicked = function checkboxClicked(e) {

        var label = this,
            input = this.querySelector('.js-checkbox');

        label.classList.toggle('form__checkbox--checked');
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


module.exports = function () {

    var init = function init() {

        var elems = document.getElementsByName('js-copyable');

        if (!elems) {
            console.log('There are no copyable elements');
            return;
        }

        Array.prototype.forEach.call(elems, prepareElements);

        console.log('Copyable module initialized');
    };

    var prepareElements = function prepareElements(element) {

        element.addEventListener('click', elementClicked);
    };

    var elementClicked = function elementClicked(e) {

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

hawk = function (hawk) {

    'use strict';

    hawk.init = function (appSettings) {

        console.log("Initialized");
    };

    hawk.checkbox = __webpack_require__(0);
    hawk.copyable = __webpack_require__(1);

    return hawk;
}({});

hawk.docReady = function (f) {

    return (/in/.test(document.readyState) ? setTimeout(hawk.docReady, 9, f) : f()
    );
};

module.exports = hawk;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map