/**
* Require CSS build
*/
require('../stylesheets/hawk.css');

hawk = (function (hawk) {

    'use strict';

    hawk.init = function ( appSettings ) {

    	console.log("Initialized");

    };

    return hawk;

})({});

hawk.docReady = function (f) {

    return /in/.test(document.readyState) ? setTimeout(hawk.docReady, 9, f) : f();

};

module.exports = hawk;
