/**
 * CodeX Transport
 * AJAX file-uploading module
 * @see {@link https://github.com/codex-team/transport}
 * @copyright CodeX Team (https://github.com/codex-team)
 */
const transport = require('codex.transport');

/**
 * Work with projects settings files
 *
 * @type {{init}}
 */
module.exports = function () {
  /**
   * Show file selection window and upload the file
   *
   * @param {Element} logoHolder — Project logo wrapper
   */
  function logoHolderClicked(logoHolder) {
    let projectId = logoHolder.dataset.projectId;

    /**
     * Loading animation class name
     * @type {string}
     */
    const loadingClass = 'project__logo-wrapper--loading';

    transport.init({
      url: 'settings/loadIcon',
      multiple: false,
      accept: 'image/*',
      data: { projectId },
      before: function () {
        logoHolder.classList.add(loadingClass);
      },
      success: function (response) {
        if (response.status !== 200) {
          hawk.notifier.show({
            message: response.message,
            style: 'error'
          });
          logoHolder.classList.remove(loadingClass);
          return;
        }

        /**
         * Find or create an image
         */
        let img = logoHolder.querySelector('img');

        if (!img) {
          img = document.createElement('img');
          logoHolder.appendChild(img);
        }

        /**
         * Update image source
         */
        img.src = response.logoUrl + '/crop/200';
        img.addEventListener('load', function () {
          logoHolder.classList.remove(loadingClass);
        });
      },
      error: function (response) {
        hawk.notifier.show({
          message: response,
          style: 'error'
        });
        logoHolder.classList.remove(loadingClass);
      }
    });
  }

  /**
   * Init all projects elements
   */
  let init = function () {
    /**
     * Activate project logo uploading
     */
    let logoHolders = document.querySelectorAll('.js_project_logo');

    if (logoHolders) {
      for (let i = logoHolders.length - 1; i >= 0; i--) {
        logoHolders[i].addEventListener('click', function () {
          logoHolderClicked(this);
        }, false);
      }
    }
  };

  return {
    init
  };
}();