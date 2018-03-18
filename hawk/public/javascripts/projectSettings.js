/**
 * CodeX Transport
 * AJAX file-uploading module
 * @see {@link https://github.com/codex-team/transport}
 * @copyright  CodeX <team@ifmo.su>
 */
const transport = require('codex.transport');

/**
 * Work with projects settings files
 */
module.exports = function () {
  /**
   * Methods for uploading logo
   * @type {{clicked(), uploading(), success(), error()}}
   */
  let logoUploader = {

    /**
     * Logo Wrapper
     */
    holder: null,

    /**
     * Show file selection window and upload the file
     *
     * @this {Element} Project logo wrapper
     */
    clicked() {
      logoUploader.holder = this;

      let projectId = logoUploader.holder.dataset.projectId,
          _csrf = logoUploader.holder.dataset.csrf;

      transport.init({
        url: 'settings/loadIcon',
        multiple: false,
        accept: 'image/*',
        data: {
          projectId,
          _csrf
        },
        before: logoUploader.uploading.start,
        success: logoUploader.success,
        error:  logoUploader.error
      });
    },

    /**
     * Loading indicator
     */
    uploading: {

      /**
       * Loading animation class name
       * @type {string}
       */
      className : 'project__logo-wrapper--loading',

      /**
       * Show loader
       */
      start: () => {
        logoUploader.holder.classList.add(logoUploader.uploading.className);
      },

      /**
       * Hide loader
       */
      stop: () => {
        logoUploader.holder.classList.remove(logoUploader.uploading.className);
      }
    },

    /**
     * Uploading succeeded
     * @param {object} response
     * @param {string} response.message - error message
     * @param {string} response.logoUrl - uploaded logo URL
     * @param {number} response.status  - response code
     */
    success(response) {
      if (response.status !== 200) {
        logoUploader.error(response);
        return;
      }

      /**
       * Find or create an image
       */
      let img = logoUploader.holder.querySelector('img');

      if (!img) {
        img = document.createElement('img');
        logoUploader.holder.appendChild(img);
      }

      /**
       * Update image source
       */
      img.src = response.logoUrl + '/crop/200';
      img.addEventListener('load', function () {
        logoUploader.uploading.stop();
      });
    },

    /**
     * Uploading failed
     * @param {object} response
     * @param {string} response.message - error message
     * @param {number} response.status    - response code
     */
    error(response = {}) {
      console.log('Project upload error ', response);

      hawkso.notifier.show({
        message: response.message || 'Uploading failed. Try another file.',
        style: 'error'
      });

      logoUploader.uploading.stop();
    }
  };



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
        logoHolders[i].addEventListener('click', logoUploader.clicked, false);
      }
    }
  };

  return {
    init
  };
}();