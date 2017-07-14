let popup = (function ( self ) {

  let elements_ = {
    items : 'garage-list-item'
  };

  let errorItems = null;

  self.init = function () {

    errorItems = document.getElementsByClassName(elements_.items);
    addItemHandlerOnClick_(errorItems);

  };

  /**
   * add event listeners
   */
  let addItemHandlerOnClick_ = function (items) {

    for(let i = 0; i < items.length; i++) {

      items[i].addEventListener('click', function () {



      }, false);

    }

  };

  return self;

})({});

module.exports = popup;
