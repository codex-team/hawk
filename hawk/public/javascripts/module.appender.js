/**
 * @module Module Appender
 *
 * Creates instanses to required modules
 * Can be customized
 *
 * Appends after element generates by class "load more button"
 */
import { Appender } from './class.appender';

module.exports = (function (self) {
  let settings_ = null;

  let moduleInited = null;

  self.init = function (settings) {
    let el = this;

    new Appender({
      url : settings.url,
      init : function (loadMoreButton) {
        el.after(loadMoreButton);
      },
      appendItemsOnLoad : function (items) {
        if (items.trim()) {
          el.insertAdjacentHTML('beforeEnd', items);
        }
      }
    });
  };

  return self;
})({});
