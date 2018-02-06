/**
 * Create a middleware for CSRF token creation and validation.
 * This middleware adds a req.csrfToken() function to make a token which should be added
 * to requests which mutate state, within a hidden form field, query-string etc.
 * This token is validated against the visitor's session or csrf cookie.
 * @link {https://github.com/expressjs/csurf}
 */

let csurf = require('csurf');

/**
 * @module csrf
 * @type {{byCookie: Function, byAjaxForm: Function}}
 */
module.exports = {
  byCookie: csurf({cookie: true}),

  /**
   * For AJAX FormData requests.
   * Also Requires 'express-formidable' middleware
   * Pass CSRF token with '_csrf' key
   */
  byAjaxForm: csurf({
    cookie: true,
    value: function (req) {
      return req.fields._csrf;
    }
  }),
};
