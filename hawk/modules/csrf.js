let csurf = require('csurf');

module.exports = function () {
  return {
    csurf: csurf({cookie: true}),
    csurfAjax: csurf({cookie: true, value: function (req) {
      return req.fields._csrf;
    }}),
  };
}();
