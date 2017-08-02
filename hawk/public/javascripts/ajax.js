/**
 * AJAX module
 */
module.exports = (function () {
  /**
   * @usage codex.ajax.call();
   */
  let call = function (data) {
    if (!data || !data.url) return;

    let XMLHTTP        = window.XMLHttpRequest ? new window.XMLHttpRequest() : new window.ActiveXObject('Microsoft.XMLHTTP'),
        successFunction  = function () {},
        errorFunction = function () {};

    data.async           = true;
    data.type            = data.type || 'GET';
    data.data            = data.data || '';
    data['content-type'] = data['content-type'] || 'application/json; charset=utf-8';
    successFunction      = data.success || successFunction;
    errorFunction        = data.error|| errorFunction;

    if (data.type === 'GET' && data.data) {
      data.url = /\?/.test(data.url) ? data.url + '&' + data.data : data.url + '?' + data.data;
    }

    if (data.withCredentials) {
      XMLHTTP.withCredentials = true;
    }

    if (data.beforeSend && typeof data.beforeSend === 'function') {
      if(data.beforeSend.call() === false) {
        return;
      }
    }

    XMLHTTP.open(data.type, data.url, data.async);

    /**
     * If we send FormData, we need no content-type header
     */
    if (!isFormData_(data.data)) {
      XMLHTTP.setRequestHeader('Content-type', data['content-type']);
    }

    XMLHTTP.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    XMLHTTP.onreadystatechange = function () {
      if (XMLHTTP.readyState === 4) {
        if (XMLHTTP.status === 200) {
          successFunction(XMLHTTP.responseText);
        } else {
          errorFunction(XMLHTTP.statusText);
        }
      }
    };

    XMLHTTP.send(data.data);
  };

  /**
   * Function for checking is it FormData object to send.
   * @param {Object} object to check
   * @return boolean
   */
  let isFormData_ = function (object) {
    return object instanceof FormData;
  };

  return {

    call : call

  };
}());
