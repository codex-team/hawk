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
  let init = function () {

    let elems = document.getElementsByName(NAMES.copyable);

    if (!elems) {
        console.log('There are no copyable elements');
        return;
    }

    for (let i = 0; i < elems.length; i++) {
        prepareElement(elems[i]);
    }

    console.log('Copyable module initialized');

  };

  /**
   * Add click listener to copyable element
   *
   * @param element
   */
  let prepareElement = function (element) {

    element.addEventListener('click', elementClicked);

  };

  /**
   * Click handler
   * Create new range, select copyable element and add range to selection. Then exec 'copy' command
   *
   * @param e
   */
  let elementClicked = function (e) {

    let selection = window.getSelection(),
        range     = document.createRange();

    range.selectNode(this);
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand('copy');
    selection.removeAllRanges();

  };

  return {
    init: init
  }

}();