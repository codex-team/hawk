module.exports = function () {

  /**
   * Hide and show error repeations stack on event page
   *
   * @param stackButton
   * @param eventId
   */
  let toggleStack = function (stackButton, eventId) {

    let eventInfo = document.querySelector('.event-info[data-event="'+eventId+'"]');

    eventInfo.classList.toggle('hide');
    stackButton.classList.toggle('event-info--opened');

  };

  return {
    toggleStack: toggleStack
  };

}();