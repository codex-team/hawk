'use strict';

module.exports = function () {
  let init = function () {
    let domain = document.querySelector('[data-counters-page-tag]').dataset;

    if (!domain) {
      return;
    }

    window.alert(domain.countersPageTag);
  };

  return {
    init: init,
  };
}();
