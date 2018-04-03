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
        hawkso.notifier.show({
          message: errors[error],
          style: 'error'
        });
      }

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

  /**
   * Send request to invite new member to the project
   *
   * @param projectId
   * @param emailOrForm
   * @param resendInvite
   */
  let inviteMember = function (projectId, emailOrForm, resendInvite = false) {
    let input, email;

    if (typeof emailOrForm === 'string') {
      email = emailOrForm;
    } else {
      input = document.getElementById(projectId);

      if (!input) return;

      email = input.value;
    }

    if (!email) return;

    hawkso.ajax.call({
      type: 'POST',
      url: '/garage/project/inviteMember',
      success: function (result) {
        hawkso.notifier.show({
          style: result.success ? 'success' : 'error',
          message: result.message
        });

        if (result.success && typeof emailOrForm !== 'string') {
          hawkso.toggler.toggle(emailOrForm);
          input.value = '';
        }
      },
      error: function () {
        hawkso.notifier.show({
          style: 'error',
          message: 'Something went wrong. Try again later.'
        });
      },
      data: JSON.stringify({
        email: email,
        projectId: projectId,
        resendInvite: resendInvite
      })
    });
  };

  /**
   * Send request to save notifications preferences for the project
   *
   * @param checkbox
   * @param projectId
   * @param userId
   */
  let saveNotifiesPreferences = function (checkbox, projectId, userId) {
    let input = checkbox.querySelector('input'),
        value = !input.checked,
        type = checkbox.dataset.name;

    hawkso.ajax.call({
      type: 'POST',
      url: '/garage/project/editNotifies',
      error: function () {
        hawkso.notifier.show({
          style: 'error',
          message: 'Can\'t save notifications preferences. Try again later'
        });
      },
      success: function (result) {
        hawkso.notifier.show({
          style: result.success ? 'success' : 'error',
          message: result.message
        });
      },
      data: JSON.stringify({
        projectId: projectId,
        userId: userId,
        type: type,
        value: value
      })
    });
  };

  /**
   * Send request to save notifications webhook
   *
   * @param projectId
   * @param userId
   * @param type
   */
  let saveWebhook = function (projectId, userId, type) {
    let input = document.getElementById(type + '-' + projectId),
        value = input.value;

    hawkso.ajax.call({
      type: 'POST',
      url: '/garage/project/saveWebhook',
      error: function () {
        hawkso.notifier.show({
          style: 'error',
          message: 'Can\'t save webhook. Try again later'
        });
      },
      success: function (result) {
        hawkso.notifier.show({
          style: result.success ? 'success' : 'error',
          message: result.message
        });
      },
      data: JSON.stringify({
        projectId: projectId,
        userId: userId,
        type: type,
        value: value
      })
    });
  };

  /**
   * Send request to grant admin access to user
   *
   * @param projectId
   * @param userId
   * @param button
   */
  let grantAdminAccess = function (projectId, userId, button) {
    hawkso.ajax.call({
      type: 'POST',
      url: '/garage/project/grantAdminAccess',
      error: function () {
        hawkso.notifier.show({
          style: 'error',
          message: 'Can\'t grant access. Try again later'
        });
      },
      success: function (result) {
        hawkso.notifier.show({
          style: result.success ? 'success' : 'error',
          message: result.message
        });
        if (result.success) {
          button.classList.add('project__member-role--admin');
          button.classList.remove('project__member-role--member');
          button.textContent = 'Admin';
        }
      },
      data: JSON.stringify({
        projectId: projectId,
        userId: userId
      })
    });
  };

  return {
    init : init,
    checkForm : checkForm,
    inviteMember: inviteMember,
    saveNotifiesPreferences: saveNotifiesPreferences,
    saveWebhook: saveWebhook,
    grantAdminAccess: grantAdminAccess
  };
}();
