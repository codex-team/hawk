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
  self.init = function (settings) {
    let el = this;

    new Appender({
      url : settings.url,
      init : function (loadMoreButton) {
        el.insertAdjacentElement('afterEnd', loadMoreButton);
      },
      appendItemsOnLoad : function (items) {
        if (items.traceback.trim()) {
          el.insertAdjacentHTML('beforeEnd', items.traceback);
        }
      }
    });
  };

  return self;
})({});
