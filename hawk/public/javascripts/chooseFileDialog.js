/**
 * Use for choose file from standard file explorer
 *
 * @type {{showChooseFileDialog}}
 */

module.exports = function () {
  /**
   * @usage hawk.showChooseFileDialog(post url address,current project id);
   */
  let transport = require('codex.transport');

  /**
   * Show choose file dialog by post method with project id.
   *
   * @param {String} url address to post data on server
   * @param {String} projectId current project id
   */
  let showChooseFileDialog = function (url, projectId) {
    transport.init({
      url: url,
      multiple: false,
      accept: 'image/*',
      data: {
        'projectId': projectId
      },
      before: function () {
        document.getElementById('file-form-' + projectId).classList.add('spinner');
        document.getElementById('logo-' + projectId).style.visibility = 'hidden';
        document.getElementById('logo-' + projectId).src = '';
      },
      progress: function (percentage) {
      },
      success: function (response) {
        if (response.status == 200) {
          document.getElementById('logo-' + projectId).src = response.logoUrl;
        } else {
          window.location.href = '/garage/settings?success=0&message=' + response.message;
        }
      },
      error: function (response) {
        window.location.href = '/garage/settings?success=0&message=Fatal error. Try again';
      },
      after: function () {
        document.getElementById('file-form-' + projectId).classList.remove('spinner');
        document.getElementById('logo-' + projectId).style.visibility = 'visible';
      }
    });
  };

  return {
    showChooseFileDialog: showChooseFileDialog
  };
}();