/**
 * Code Styling module
 */
module.exports = function codeStyling() {
  'use strict';

  /**
   * DOM manipulations helper
   */
  const $ = require('./dom').default;

  /**
   * Loading state
   * @type {Promise|null}
   */
  let resourcesLoading = null;

  /**
   * Extrnal library for code styling
   * @link https://highlightjs.org
   * @type {Object}
   */
  const library = {
    js: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js',
    css : '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github-gist.min.css'
  };

  /**
   * Loads styling library
   */
  let prepare = function () {
    return Promise.all([
      $.loadResource('JS', library.js, 'highlight'),
      $.loadResource('CSS', library.css, 'highlight')
    ]).catch( err => console.warn('Cannot load code styling module: ', err))
      .then( () => console.log('Code Styling is ready') );
  };

  /**
   * Finds code blocks and fires highlighting
   */
  let init = function () {
    let codeBlock = this;

    console.log('codeBlock', codeBlock);

    if (!resourcesLoading) {
      resourcesLoading = prepare();
    }

    resourcesLoading.then( () => {
      if (!window.hljs) {
        console.warn('Code Styling script loaded but not ready');
        return;
      }

      window.hljs.highlightBlock(codeBlock);
    });
  };

  return {
    init
  };
}();