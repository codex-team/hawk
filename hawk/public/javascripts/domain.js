module.exports = function () {

  /**
   * Unlink domain handler
   *
   * @param button
   * @param token - domain token
   */
  let unlink = function (button, token) {

    let success = function () {

      hawk.notifier.show({
        message: 'Domain was successfully unlinked',
        style: 'success'
      });
      button.parentNode.remove();

    };

    let error = function () {

      hawk.notifier.show({
        message: 'Sorry, there is a server error',
        style: 'error'
      });

    };

    let sendAjax = function () {

      hawk.ajax.call({
        data: 'token='+token,
        type: 'GET',
        success: success,
        error: error,
        url: 'settings/unlink'
      });

    };

    let domain = button.dataset.name;

    hawk.notifier.show({
      message: 'Confirm ' + domain + ' unlinking',
      type: 'confirm',
      okText: 'Unlink',
      okHandler: sendAjax
    });

  };

  return {
    unlink: unlink
  };

}();