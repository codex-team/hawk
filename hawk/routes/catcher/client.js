let events   = require('../../models/events');
let notifies = require('../../models/notifies');
let WebSocket = require('ws');
let md5 = require('../../modules/utils').md5;
let sourceMap = require('source-map');
let stack = require('../../modules/stack');
let project = require('../../models/project');
const JSSource = require('../../models/js-source');

/**
 * @see {@link https://github.com/ptarjan/node-cache}
 */
const cache = require('memory-cache');


/**
 * @typedef {object} JSCatcherInput
 * @property {string}   token - Project's Token
 * @property {string}   message - main Error text
 * @property {object}   error_location
 * @property {string}   error_location.file
 * @property {number}   error_location.line
 * @property {number}   error_location.col
 * @property {string}   error_location.func - function name. Filled after source-map parsing
 * @property {string}   error_location.fileOrigin - bundle's URL. Filled after source-map parsing
 * @property {string}   error_location.revision  - bundle's revision
 * @property {object}   location
 * @property {string}   location.url
 * @property {string}   location.origin
 * @property {string}   location.host
 * @property {string}   location.path
 * @property {string}   location.port
 * @property {StackItem[]}   stack
 * @property {string}   time
 * @property {object}   navigator
 * @property {string}   navigator.ui
 * @property {object}   navigator.frame
 * @property {object}   navigator.frame.width
 * @property {object}   navigator.frame.height
 */
/**
 * @typedef {object} StackItem
 * @property {string} func - function name
 * @property {string} file - file location
 * @property {number} line
 * @property {number} col
 */
/**
 * @typedef {object} originalPosition
 * @description Data Format got from source-map consuming
 * @property {string} source
 * @property {number} line
 * @property {number} column
 * @property {string} name
 */

/**
 * Errors that can be sent to user
 */
const ERR_TYPES = {
  accessDenied: 'Access denied',
  internalError: 'Unsuccessful error catching'
};


/* GET client errors. */
let receiver = new WebSocket.Server({
  path: '/catcher/client',
  port: process.env.SOCKET_PORT
});

/**
 * Get info about user browser and platform
 *
 * @returns {{browser: {name: *, version: *, engine, capability}, device: {os, osversion: *, type}, userAgent: string}}
 */
let detect = function (ua) {
  let bowser = require('bowser')._detect(ua);

  let getRenderingEngine = function () {
    if (bowser.webkit) return 'Webkit';
    if (bowser.blink) return 'Blink';
    if (bowser.gecko) return 'Gecko';
    if (bowser.msie) return 'MS IE';
    if (bowser.msedge) return 'MS Edge';

    return undefined;
  };

  let getOs = function () {
    if (bowser.mac) return 'MacOS';
    if (bowser.windows) return 'Windows';
    if (bowser.windowsphone) return 'Windows Phone';
    if (bowser.linux) return 'Linux';
    if (bowser.chromeos) return 'ChromeOS';
    if (bowser.android) return 'Android';
    if (bowser.ios) return 'iOS';
    if (bowser.firefox) return 'Firefox OS';
    if (bowser.webos) return 'WebOS';
    if (bowser.bada) return 'Bada';
    if (bowser.tizen) return 'Tizen';
    if (bowser.sailfish) return 'Sailfish OS';

    return undefined;
  };

  let getDeviceType = function () {
    if (bowser.tablet) return 'tablet';
    if (bowser.mobile) return 'mobile';

    return 'desktop';
  };

  let getCapability = function () {
    if (bowser.a) return 'full';
    if (bowser.b) return 'degraded';
    if (bowser) return 'minimal';

    return 'browser unknown';
  };

  let browser = {
    name: bowser.name,
    version: bowser.version,
    engine: getRenderingEngine(),
    capability: getCapability()
  };

  let device = {
    os: getOs(),
    osversion: bowser.osversion,
    type: getDeviceType()
  };

  return {
    browser: browser,
    device: device,
    userAgent: ua
  };
};

/**
 * Reads near-placed lines from the original source
 * @param {BasicSourceMapConsumer} consumer
 * @param {originalPosition} original
 * @return {{line: number, content: string}[]|null}
 */
function readSourceLines(consumer, original) {
  let sourceContent = consumer.sourceContentFor(original.source, true);

  if (!sourceContent){
    return null;
  }

  const margin = 5;
  let lines = sourceContent.split(/(?:\r\n|\r|\n)/g);
  let focusedLines = lines.slice(original.line - margin - 1, original.line + margin);
  let output = focusedLines.map((line, idx) => {
    return {
      line: Math.max(original.line - margin + idx, 1),
      content: line,
    }
  });

  return output;
}

/**
 * Loads external js-source with source-map
 * @param {string} projectId
 * @param {string} url
 * @param {string} revision
 * @return {Promise<JSSourceItem>|null}
 */
async function downloadSource(projectId, url, revision) {

  let isAbsoluteURL = /https?:\/\/\S+\.js(\?\S+)?$/.test(url);

  /**
   * Source code can't be downloaded
   */
  if (!isAbsoluteURL){
    logger.log('JS source downloading skipped because of URL: %s', url);
    return null;
  }

  let source = new JSSource({
    projectId,
    url,
    revision: revision
  });

  return await source.load();
}

/**
 * Promise style decorator around source-map consuming method
 * @param {object} mapBody - source map
 * @return {Promise.<BasicSourceMapConsumer>}
 */
async function consumeSourceMap(mapBody) {
  return new Promise((resolve) => {
    sourceMap.SourceMapConsumer.with(mapBody, null, consumer => {
      resolve(consumer);
    });
  })
}

/**
 * Return cache key for a message
 * @param {string} projectId
 * @param {JSCatcherInput} message
 * @return {string}
 */
function getCacheKeyForAMessage(projectId, message) {
  let bundle = message.error_location.file,
      revision = message.error_location.revision,
      line = message.error_location.line,
      col =  message.error_location.col;

  return `js-event-catched:project:${projectId}:bundle:${bundle}:revision:${revision}:line:${line}:col:${col}`;
}

/**
 * Consume source-map, parse stack
 * @param {string} projectId
 * @param {JSCatcherInput} message
 * @return {JSCatcherInput}
 */
async function processMessage(projectId, message) {
  /**
   * Remember original script location. (It may be overridden by source-map module name)
   */
  let bundleLocation = message.error_location.file;
  /**
   * Download source-map
   * @type {JSSourceItem|}
   */
  let jsSource = await downloadSource(projectId, bundleLocation, message.error_location.revision);

  /**
   * Parse Stack
   * @type {StackItem[]}
   */
  message.stack = stack.parse(message);

  /**
   * Analyze source map to find original position
   */
  if (jsSource && jsSource.sourceMapBody.length){
    /**
     * Accept source map
     * @type {BasicSourceMapConsumer}
     */
    let consumer = await consumeSourceMap(jsSource.sourceMapBody);

    /**
     * Error's original position
     */
    let originalLocation = consumer.originalPositionFor({
      line: message.error_location.line,
      column: message.error_location.col
    });

    /**
     * override error location from this
     * {
         *    file: 'http://v.dtf.osnova.io/static/build/v.dtf.osnova.io/all.min.js?1528101883',
         *    line: 18,
         *    col: 7658,
         *    revision: 1528101883,
         * }
     *
     * with parsed location data
     * {
         *    source: 'src/Components/MainMenu/js/modules/module.main_menu.js',
         *    line: 129,
         *    column: 40,
         *    name: 'getElementsByName'
         * }
     */
    if (originalLocation.source){
      message.error_location.file = originalLocation.source;
      message.error_location.fileOrigin = bundleLocation; // save bundle's URL
    }
    if (originalLocation.line){
      message.error_location.line = originalLocation.line;
    }
    if (originalLocation.column){
      message.error_location.col = originalLocation.column;
    }
    if (originalLocation.name){
      message.error_location.func = originalLocation.name;
    }

    /**
     * Stack's original position
     */
    message.stack = !message.stack ? [] : message.stack.map(item => {
      let original = consumer.originalPositionFor({
        line: item.line,
        column: item.col
      });

      let trace = null;
      if (original.source) {
        trace = readSourceLines(consumer, original);
      }

      return {
        func: original.name || item.func,
        file: original.source || item.file,
        line: original.line || item.line,
        col: original.column || item.col,
        trace
      }
    });
  }

  return message;
}

/**
 * Handler for socket messages
 * @param {JSCatcherInput} message
 * @throws {Error} - Access denied
 * @return {Promise}
 */
function handleMessage(message) {
  logger.info('Got javascript error from ' + message.location.host);

  // load project
  return project.getByToken(message.token)
    .then(foundProject => {
      if (!foundProject) {
        throw new Error(ERR_TYPES.accessDenied);
      }
      return foundProject;
    })
    .then(async foundProject => {

      const messageCacheKey = getCacheKeyForAMessage(foundProject._id, message);

      console.log('messageCacheKey', messageCacheKey);
      console.log('find in cache');
      let processedMessageFromCache = cache.get(messageCacheKey);

      if (processedMessageFromCache) {
        console.log('got from cache!');
        message = processedMessageFromCache;
      } else {
        console.log('not found in cache :(');
        message = await processMessage(foundProject._id, message);
        // cache processed error for an 1 hour
        cache.put(messageCacheKey, message, 3600000);
        console.log('putted in cache');
      }

      /**
       * Compose grouping hash
       * @type {string}
       */
      let groupHash = md5(message.message);
      let clientInfo = detect(message.navigator.ua);

      clientInfo.device.width = message.navigator.frame.width;
      clientInfo.device.height = message.navigator.frame.height;
      /**
       * Prepare Event
       */
      let event = {
        type          : 'client',
        tag           : 'javascript',
        message       : message.message,
        errorLocation : message.error_location,
        location      : message.location,
        groupHash     : groupHash,
        stack         : message.stack,
        userAgent     : clientInfo,
        time          : Math.floor(message.time / 1000)
      };

      /**
       * Save event
       */
      // console.log('Processed event to write in DB', event);
      await events.add(foundProject._id, event);

      /**
       * Send notifications
       */
      await notifies.send(foundProject, event);
    });
}

/**
 * Socket connection handler
 * @param ws
 */
function socketConnected (ws) {
  ws.on('message', function (message) {
    // console.log('Client catcher received a message: %o', message);
    Promise.resolve(message)
      .then(JSON.parse)
      .then( message => {
        return handleMessage(message);
      })
      .catch( error => {
        logger.error('JS catcher message handling error: %e', error);
        if (error.message === ERR_TYPES.accessDenied){
          ws.send(JSON.stringify({type: 'error', message: error.message}));
          ws.close();
        } else {
          ws.send(JSON.stringify({type: 'error', message: ERR_TYPES.internalError}));
        }
      })
  });
}

receiver.on('connection', socketConnected);

/**
 * Workaround connection errors.
 *
 * @since 2018-08-02
 * Added due to bug described here {@link https://github.com/websockets/ws/issues/1256}:
 * Server falls with TCP Connection Error on client disconnection at Chrome 63
 */
receiver.on('error', error => {
  logger.log('Sockets Receiver got an Error: ');
  logger.log(error);
});