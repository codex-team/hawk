module.exports = function () {
  let transport = require('codex.transport');

  /**
   * Run choose file dialog by post method with project id.
   *
   * @param {String} url
   * @param {String} projectId
   */
  let runChooseFileDialog = function (url, projectId) {
    transport.init({
      url: url,
      multiple: false,
      accept: 'image/*',
      data: {
        'projectId': projectId
      },
      before: function () {},
      progress: function (percentage) {
        document.getElementById('logo-' + projectId).src = '/static/images/miss-image.png';
        document.getElementById('progress-logo-' + projectId).style.visibility = 'visible';
      },
      success: function (response) {
        if (response.status == 200) {
          document.getElementById('logo-' + projectId).src = response.logoUrl;
          document.getElementById('progress-logo-' + projectId).style.visibility = 'hidden';
        } else {
          window.location.href = '/garage/settings?success=0&message=' + response.message;
        }
      },
      error: function (response) {
        window.location.href = '/garage/settings?success=0&message=Fatal error. Try again';
      },
      after: function () {}
    });
  };

  return {
    runChooseFileDialog: runChooseFileDialog
  };
}();