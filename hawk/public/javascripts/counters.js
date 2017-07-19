'use strict';

module.exports = function () {
  let generateKey = function (domain, tag) {
    let key = domain + ':' + tag;

    return key;
  };

  let updateState = function (domain, tag, value) {
    let key = generateKey(domain, tag);

    window.localStorage.setItem(key, value);
  };

  let init = function () {
    let errorList = document.querySelector('[data-counters-page-tag]');

    if (!errorList) {
      return;
    }

    let domain = errorList.dataset;

    console.log(domain);

    // window.alert(domain.countersPageTag);
  };

  return {
    init: init,
  };
}();
