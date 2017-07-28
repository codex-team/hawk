/**
 * Module for checking settings form before sending
 */

module.exports = function () {
  const IDS = {
    password: 'password',
    repeatedPassword: 'repeatedPassword'
  };

  /** Array for catched errors */
  let errors = {};

  let init = function () {
    console.log('SettingsForm module initialized');
  };

  /**
   * Runs tests for validity
   */
  let checkForm = function (event) {
    /** Reset errors array */
    errors = {};

    /** Tests */
    checkPassword();
    /** */

    /** if tests were failed */
    if ( Object.keys(errors).length ) {
      for (let error in errors) {
        hawk.notifier.show({
          message: errors[error],
          style: 'error'
        });
      };

      /** Prevent form sending */
      event.preventDefault();
    }
  };

  /**
   * Check passwords fields
   */
  let checkPassword = function () {
    let password = document.getElementById(IDS.password),
        repeatedPassword = document.getElementById(IDS.repeatedPassword);

    if (password.value != repeatedPassword.value) {
      errors['repeatedPassword'] = 'Passwords don\'t match.';
    }
  };


  return {
    init : init,
    checkForm : checkForm,
  };
}();
