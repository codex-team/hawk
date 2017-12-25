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
   * @param event information about clicked object
   */
  function logoHolderClicked(event) {
    let projectId = event.target.dataset['projectId'];
    let cssLoaderClass = event.target.dataset['cssLoaderClass'];

    let projectLogo = document.getElementById('project-logo-' + projectId);
    let projectLogoImg = document.getElementById('logo-' + projectId + '-img');

    transport.init({
      url: 'settings/loadIcon',
      multiple: false,
      accept: 'image/*',
      data: {
        'projectId': projectId
      },
      before: function () {
        projectLogo.classList.add(cssLoaderClass);
        projectLogoImg.style.visibility = 'hidden';
      },
      progress: function (percentage) {
      },
      success: function (response) {
        if (response.status == 200) {
          projectLogoImg.src = response.logoUrl;
          projectLogoImg.onload = function () {
            uploadProjectIconResult({
              status: response.status,
              response: response,
              projectLogoImg: projectLogoImg,
              projectLogo: projectLogo,
              cssLoaderClass: cssLoaderClass
            });
          };
        } else {
          uploadProjectIconResult({
            status: response.status,
            response: response.message,
            projectLogoImg: projectLogoImg,
            projectLogo: projectLogo,
            cssLoaderClass: cssLoaderClass
          });
        }
      },
      error: function (response) {
        uploadProjectIconResult({
          status: 500,
          response: response,
          projectLogoImg: projectLogoImg,
          projectLogo: projectLogo,
          cssLoaderClass: cssLoaderClass
        });
      },
      after: function () {
      }
    });
  }

  /**
   *
   * {Int} status - operation result code. 500 - error, 200 - done
   * {String} response -  error message
   * {Document element} projectLogoImg - projectLogoImg document element
   * {Document element} projectLogo - projectLogo document element
   * {String} cssLoaderClass - css loader class name
   *
   * Example
   * {
          status: 500,
          response: response,
          projectLogoImg: projectLogoImg,
          projectLogo: projectLogo,
          cssLoaderClass: cssLoaderClass
     }

   * @param {JSON} data information about upload operation. Use JSON format above.
   *
   */
  let uploadProjectIconResult = function (data) {
    if (data.status == 500)
      hawk.notifier.show({
        message: data.response,
        style: 'error'
      });
    data.projectLogo.classList.remove(data.cssLoaderClass);
    data.projectLogoImg.style.visibility = 'visible';
  };

  /**
   * Init all project logo icon
   */
  let init = function () {
    let logoHolders = document.querySelectorAll('.js_project_logo');

    if (logoHolders) {
      for (var i = 0; i < logoHolders.length; i++) {
        let logoHolder = logoHolders[i];

        logoHolder.addEventListener('click', logoHolderClicked, false);
      }
    }
  };

  return {
    init: init,
  };
}();