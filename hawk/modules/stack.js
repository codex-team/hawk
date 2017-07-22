module.exports = function () {
  let event = null,
      stack = null;

  const REGEXPS = {
    /* FF example: throwError@http://localhost:63342/hawk.client/index.html:10:28 */
    FF_SAFARI_OPERA_11: /(.*)@(\S+)\:(\d+):(\d+)/,

    /* Chrome example: at throwError (index.html?_ijt=pnsmb0fcsfavevcnj0g1a9sq:10) */
    CHROME_IE: /^\s*at (.*) \((\S+):(\d+):(\d+)\)/m,

    /* Opera <11 regexps */
    OPERA_9: /Line (\d+).*script (?:in )?(\S+)/i,
    OPERA_10: /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i,

  };

  /** Parse Chrome and IE stack
   *
   * @example
   * Uncaught TypeError: Cannot read property 'foo' of undefined
   * at throwError (index.html:10)
   * at HTMLButtonElement.onclick (index.html:19)
   *
   **/
  let parseChromeIE = function () {
    let filtered = stack.split('\n').filter(function (line) {
      return REGEXPS.CHROME_IE.test(line);
    });

    return filtered.map(function (line) {
      if (/eval/.test(line)) {
        /* Replace eval calls to expected format */
        line = line.replace(/eval \(/, '').replace(/, .*:\d+:\d+\)/, '');
      }

      let matches = REGEXPS.CHROME_IE.exec(line);

      return {
        func: matches[1],
        file: matches[2],
        line: matches[3],
        col: matches[4]
      };
    });
  };

  /** Parse Safari, FireFox and Opera >=11 stack
   *
   *  @example
   *  throwError@http://hawk.client/index.html:10:28
   *  onclick@http://hawk.client/index.html:19:12
   *
   */
  let parseSafariOpera11FF = function () {
    let filtered = stack.split('\n').filter(function (line) {
      return !/^Error created at/.test(line) && REGEXPS.FF_SAFARI_OPERA_11.test(line);
    });

    return filtered.map(function (line) {
      let matches = REGEXPS.FF_SAFARI_OPERA_11.exec(line);

      return {
        func: matches[1],
        file: matches[2],
        line: matches[3],
        col: matches[4]
      };
    });
  };

  /** Opera 9 hasn't stack property. Error info is contained in error message **/
  let parseOpera9 = function () {
    let filtered = event.message.split('\n').filter(function (line) {
      return REGEXPS.OPERA_9.test(line);
    });

    return filtered.map(function (line) {
      let matches = REGEXPS.OPERA_9.exec(line);

      return {
        file: matches[2],
        line: matches[1]
      };
    });
  };

  /** Parse Opera 10 stack **/
  let parseOpera10 = function () {
    let filtered = stack.split('\n').filter(function (line) {
      return REGEXPS.OPERA_10.test(line);
    });

    return filtered.map(function (line) {
      let matches = REGEXPS.OPERA_10.exec(line);

      return {
        func: matches[3] || undefined,
        file: matches[2],
        line: matches[1]
      };
    });
  };

  /**
   * Parse stack string for different browsers
   *
   * @param event_
   * @returns {*}
   */
  let parseStack = function (event_) {
    event = event_;
    stack = event.stack;

    if (REGEXPS.OPERA_9.test(event.message)) {
      stack = parseOpera9();
    } else if (REGEXPS.OPERA_10.test(stack)) {
      stack = parseOpera10();
    } else if (REGEXPS.CHROME_IE.test(stack)) {
      stack = parseChromeIE();
    } else if (REGEXPS.FF_SAFARI_OPERA_11.test(stack)) {
      stack = parseSafariOpera11FF();
    } else {
      /* Unsupported stack format, just split by \n */
      stack = stack.split('\n').map(function (line) {
        return {
          file: line
        };
      });
    }

    return stack;
  };

  return {
    parse: parseStack
  };
}();
