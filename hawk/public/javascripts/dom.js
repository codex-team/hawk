/**
 * DOM manipulations methods
 */
export default class DOM {
  /**
   * Helper for making Elements with classname and attributes
   * @param  {string} tagName           - new Element tag name
   * @param  {array|string} classNames  - list or name of CSS classname(s)
   * @param  {Object} attributes        - any attributes
   * @return {Element}
   */
  static make(tagName, classNames, attributes) {
    var el = document.createElement(tagName);

    if ( Array.isArray(classNames) ) {
      el.classList.add(...classNames);
    } else if( classNames ) {
      el.classList.add(classNames);
    }

    for (let attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  /**
  * Replaces node with
  * @param {Element} nodeToReplace
  * @param {Element} replaceWith
  */
  static replace(nodeToReplace, replaceWith) {
    return nodeToReplace.parentNode.replaceChild(replaceWith, nodeToReplace);
  }

  /**
   * Escaping html function
   * @param html
   * @return {string}
   */
  static escapeHTML(html) {
    let htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };

    // Regex containing the keys listed immediately above.
    let htmlEscaper = /[&<>"'\/]/g;

    return ('' + html).replace(htmlEscaper, function (match) {
      return htmlEscapes[match];
    });
  }
}
