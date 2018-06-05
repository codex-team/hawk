module.exports = function () {
  /**
   * Hide and show error repeations stack on event page
   *
   * @param stackButton
   * @param eventId
   */
  let toggleStack = function (stackButton, eventId) {
    let eventInfo = document.querySelector('.event-info[data-event="'+eventId+'"]');

    /**
     * Close prevoiusly opened rows
     */
    let previouslyOpenedRows = document.querySelectorAll('.event-info--opened'),
        previouslyOpenedStacks = document.querySelectorAll('.event-info');

    previouslyOpenedRows.forEach( row => row.classList.remove('event-info--opened'));
    previouslyOpenedStacks.forEach( stack => stack.classList.add('hide'));

    eventInfo.classList.toggle('hide');
    stackButton.classList.toggle('event-info--opened');
  };

  return {
    toggleStack: toggleStack
  };
}();