/**
 * This module allows add event listeners for keyboard keys.
 *
 * @examples
 * element.addEventListener('enter', myEnterHandler);
 * element.addEventListener('space', mySpaceHandler);
 * element.addEventListener('keyc', myCKeyHandler);
 *
 * CustomEvent will be passed to your handler with original event in detail property
 *
 * function myEnterHandler (customEvent) {
 *    console.log('Here is original keyDown event: ', customEvent.detail);
 * }
 *
 * Or you can just add 'on' + keyName attribute to element like onclick or onkeydown
 * @example
 * <input onenter="console.log('You press enter on: ', this); console.log('Here is event: ', event);">
 *
 * @type {{init}}
 */
module.exports = function () {
  let init = function () {
    window.addEventListener('keydown', keyDownHandler);
  };

  let keyDownHandler = function (event) {
    let eventType = event.code.toLowerCase(),
        target = event.target;

    if (target.hasAttribute('on' + eventType)) {
      try {
        evalAttributeCode.call(target, event);
      } catch (e) {
        console.log('Error while eval %o on%s code: %o', target, eventType, e);
      }
    }

    let customEvent = new CustomEvent(eventType, {
      detail: event,
      bubbles: true
    });

    target.dispatchEvent(customEvent);
  };

  let evalAttributeCode = function (event) {
    eval(this.getAttribute('on' + event.key.toLowerCase()));
  };

  return {
    init: init
  };
}();