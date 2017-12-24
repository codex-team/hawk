/**
 * Use manage file working in project
 *
 * @type {{showChooseFileDialog}}
 */

module.exports = function () {
  let transport = require('codex.transport');

  /**
   * Show choose file dialog by post method with project id.
   *
   * @param {String} url address to post data on server
   * @param {String} projectId current project id
   */
  let showChooseFileDialog = function (args) {
    transport.init({
      url: args.url,
      multiple: args.multiple,
      accept: args.multiple,
      data: args.data,
      before: args.before,
      progress: args.process,
      success: args.success,
      error: args.error,
      after: args.after
    });
  };

  /**
   * Call chhose file dialog with define parameters. Use codex.transport
   *
   * @param  {projectId: projectId} data logo description
   */
  function logoHolderClicked(event) {
    let projectId = event.target.dataset['projectid'];

    console.info(event.target);
    transport.init({
      url: 'settings/loadIcon',
      multiple: false,
      accept: 'image/*',
      data: {
        'projectId': projectId
      },
      before: function () {
        document.getElementById('project-logo-' + projectId).classList.add('spinner');
        document.getElementById('logo-' + projectId + '-img').style.visibility = 'hidden';
        document.getElementById('logo-' + projectId + '-img').src = '';
      },
      progress: function (percentage) {
      },
      success: function (response) {
        if (response.status == 200) {
          document.getElementById('logo-' + projectId + '-img').src = response.logoUrl;
        } else {
          window.location.href = '/garage/settings?success=0&message=' + response.message;
        }
      },
      error: function (response) {
        window.location.href = '/garage/settings?success=0&message=Fatal error. ' + response;
      },
      after: function () {
        document.getElementById('project-logo-' + projectId).classList.remove('spinner');
        document.getElementById('logo-' + projectId + '-img').style.visibility = 'visible';
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

        logoHolder.addEventListener('click', logoHolderClicked, false);
      }
    }
  };

  return {
    init: init,
  };
}();