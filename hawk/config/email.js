module.exports = (function () {

  var email = (function () {

    var host = 'smtp.yandex.ru',
        port = 465,
        auth = {
          user: 'codex.ifmo',
          pass: 'pSF-HDu-WVt-re3'
        },
        from = {
          name: 'CodeX Hawk',
          email: 'hawk@ifmo.su'
        };

    return {
        host: host,
        port: port,
        auth: auth
    }

  })();

  return {
    email: email,
  }

})();
