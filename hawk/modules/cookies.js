/**
* Return cookie value from headers.cookies string by name
*/

module.exports = function (cookies, name) {

  if (!cookies) return undefined;

  var match = cookies.match(new RegExp('\\b'+name+'=([^;]*)'));

  return match ? decodeURIComponent(match[1]) : undefined;

};
