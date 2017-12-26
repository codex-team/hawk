/**
 * Use manage file working in project
 *
 * @type {{showChooseFileDialog}}
 */

module.exports = function () {
  let transport = require('codex.transport');

  /**
   * Call choose file dialog with define parameters. Use codex.transport
   *
   * @param {MouseEvent} event information about clicked object
   */
  function logoHolderClicked(logoHolder) {
    let projectId = logoHolder.dataset['projectId'];

    let projectLogoImg = logoHolder.querySelector('img');

    transport.init({
      url: 'settings/loadIcon',
      multiple: false,
      accept: 'image/*',
      data: {
        'projectId': projectId
      },
      before: function () {
        logoHolder.classList.add('project__logo-wrapper--loading');
      },
      progress: function (percentage) {
      },
      success: function (response) {
        if (response.status == 200) {
          projectLogoImg.src = response.logoUrl;
          projectLogoImg.onload = function () {
            logoHolder.classList.remove('project__logo-wrapper--loading');
          };
        } else {
          hawk.notifier.show({
            message: response.message,
            style: 'error'
          });
          logoHolder.classList.remove('project__logo-wrapper--loading');
        }
      },
      error: function (response) {
        hawk.notifier.show({
          message: response,
          style: 'error'
        });
        logoHolder.classList.remove('project__logo-wrapper--loading');
      },
      after: function () {
      }
    });
  }

  /**
   * Init all project logo icon
   */
  let init = function () {
    let logoHolders = document.querySelectorAll('.js_project_logo');

    if (logoHolders) {
      for (var i = 0; i < logoHolders.length; i++) {
        let logoHolder = logoHolders[i];

        logoHolder.addEventListener('click', function () {
          logoHolderClicked(this);
        }, false);
      }
    }
  };

  return {
    init: init,
  };
}();