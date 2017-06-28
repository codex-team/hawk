/**
 * Copyable module allows you to add text to copy buffer by click
 * Just add 'js-copyable' name to element
 *
 * @usage
 * <span name='js-copyable'>Click to copy</span>
 *
 * @type {{init}}
 */
module.exports = function () {

  const NAMES = {
    copyable: 'js-copyable'
  };

  /**
   * Take element by name and pass it to prepareElement function
   */
  let init = function (copiedCallback) {

    let elems = document.getElementsByName(NAMES.copyable);

    if (!elems) {

      console.log('There are no copyable elements');
      return;

    }

    for (let i = 0; i < elems.length; i++) {

      prepareElement(elems[i], copiedCallback);

    }

    console.log('Copyable module initialized');

  };

  /**
   * Add click listener to copyable element
   *
   * @param element
   */
  let prepareElement = function (element, copiedCallback) {

    element.addEventListener('click', elementClicked);
    element.addEventListener('copied', copiedCallback);


  };

  /**
   * Click handler
   * Create new range, select copyable element and add range to selection. Then exec 'copy' command
   */
  let elementClicked = function () {

    let selection = window.getSelection(),
      range     = document.createRange();

    range.selectNodeContents(this);
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand('copy');
    selection.removeAllRanges();

    let CopiedEvent = new CustomEvent('copied', {
      bubbles: false,
      cancelable: false,
      detail: range.toString()
    });

    this.dispatchEvent(CopiedEvent);

  };

  return {
    init: init
  };

}();