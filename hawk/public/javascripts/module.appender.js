/**
 * @module Module Appender
 *
 * Creates instances to required modules
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
        if (settings.onLoadItems) {
          try {
            eval(settings.onLoadItems);
          } catch (e) {
            console.log('Can\'t fire onLoadItems functions because of %o', e);
          }
        }
      },
      onError : function () {
        hawkso.notifier.show({
          message: 'Can\'t load data. Please try again later',
          style: 'error'
        });
      }
    });
  };

  return self;
})({});
