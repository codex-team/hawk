import { Appender } from './class.appender';

module.exports = (function (self) {
  let settings_ = null;

  let moduleInited = null;

  self.init = function (settings) {
    let el = this;

    new Appender({
      url : settings.url,
      init : function (preloader) {
        el.after(preloader);
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
