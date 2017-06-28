module.exports = function () {

  let unlink = function (button, token) {

    let success = function () {

      window.alert('Domain unlinked');
      button.parentNode.remove();

    };

    let error = function () {

      window.alert('Sory, there are server error');

    };

    hawk.ajax.call({
      data: 'token='+token,
      type: 'GET',
      success: success,
      error: error,
      beforeSend: window.confirm.bind(null, 'Are you sure?'),
      url: 'settings/unlink'
    });

  };

  return {
    unlink: unlink
  };

}();