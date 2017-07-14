module.exports = function () {

  /**
   * Hide and show error repeations stack on event page
   *
   * @param stackButton
   * @param eventId
   */
  let toggleStack = function (stackButton, eventId) {

    let stackTable = document.querySelector('.stack-table[data-event="'+eventId+'"]');

    stackTable.classList.toggle('hide');
    stackButton.classList.toggle('repeations__stack--opened');

  };

  return {
    toggleStack: toggleStack
  };

}();