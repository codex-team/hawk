/**
 * Custom checkboxes module
 *
 * Just add name 'custom-checkbox' to element
 * Use data attributes to configure inputs:
 *  - data-name    -- input name
 *  - data-value   -- (optional) input value
 *  - data-checked -- (optional) default input state
 *
 * @usage
 * <label name='custom-checkbox'
 *        class='form__checkbox'
 *        data-name='my-checkbox'
 *        data-checked='true'>
 *
 *      My checkbox
 *
 * </label>
 *
 *
 * @type {{init}}
 */
module.exports = function () {
  const CLASSES = {
    customCheckbox: 'form__checkbox',
    checkedCheckbox: 'form__checkbox--checked',
    defaultCheckbox: 'default-checkbox'
  };

  const NAMES = {
    customChecbox: 'custom-checkbox'
  };

  /**
   * Prepare elements with 'custom-checkbox' name
   */
  let init = function () {
    let checkboxes = document.getElementsByName(NAMES.customChecbox);

    if (!checkboxes) {
      console.log('There are no checkboxes on page');
      return;
    }

    for (let i = 0; i < checkboxes.length; i++) {
      prepareElement(checkboxes[i]);
    }

    console.log('Checkboxes initialized');
  };

  /**
   * Insert default input into custom checkbox holder and add click listener to holder
   *
   * @param checkbox
   */
  let prepareElement = function (checkbox) {
    let input = document.createElement('input');

    input.type = 'checkbox';
    input.classList.add(CLASSES.defaultCheckbox);

    input.name = checkbox.dataset.name;

    if (checkbox.dataset.value) {
      input.value = checkbox.dataset.value;
    }

    if (checkbox.dataset.checked) {
      checkbox.classList.add(CLASSES.checkedCheckbox);
      input.checked = true;
    }

    checkbox.appendChild(input);
    checkbox.addEventListener('click', checkboxClicked);
  };

  /**
   * Add CLASSES.checkedCheckbox class to custom checkbox holder and toggle default input state
   *
   * @param e
   */
  let checkboxClicked = function (e) {
    let label = this,
        input = this.querySelector('.'+CLASSES.defaultCheckbox);

    label.classList.toggle(CLASSES.checkedCheckbox);
    input.checked = !input.checked;

    e.preventDefault();
  };

  return {
    init: init
  };
}();