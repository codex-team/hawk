let events   = require('../../models/events');
let notifies = require('../../models/notifies');
let WebSocket = require('ws');
let Crypto = require('crypto');
let sourceMap = require('source-map');
let stack = require('../../modules/stack');
let project = require('../../models/project');
const JSSource = require('../../models/js-source');

/**
 * @typedef {object} JSCatcherInput
 * @property {string}   token - Project's Token
 * @property {string}   message - main Error text
 * @property {object}   error_location
 * @property {string}   error_location.file
 * @property {number}   error_location.line
 * @property {number}   error_location.col
 * @property {string}   error_location.revision  - bundle's revision
 * @property {object}   location
 * @property {string}   location.url
 * @property {string}   location.origin
 * @property {string}   location.host
 * @property {string}   location.path
 * @property {string}   location.port
 * @property {string}   stack
 * @property {string}   time
 * @property {object}   navigator
 * @property {string}   navigator.ui
 * @property {object}   navigator.frame
 * @property {object}   navigator.frame.width
 * @property {object}   navigator.frame.height
 */

let md5 = function (input) {
  return Crypto.createHash('md5').update(input, 'utf8').digest('hex');
};




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

/* GET client errors. */
let receiver = new WebSocket.Server({
  path: '/catcher/client',
  port: process.env.SOCKET_PORT
});


const rawSourceMap = {
  version: 3,
  file: 'min.js',
  names: ['bar', 'baz', 'n'],
  sources: ['one.js', 'two.js'],
  sourceRoot: 'http://example.com/www/js/',
  mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA'
};

sourceMap.SourceMapConsumer.with(rawSourceMap, null, consumer => {

  console.log('sources', consumer.sources);
  // [ 'http://example.com/www/js/one.js',
  //   'http://example.com/www/js/two.js' ]

  console.log(consumer.originalPositionFor({
    line: 2,
    column: 28
  }));
  // { source: 'http://example.com/www/js/two.js',
  //   line: 2,
  //   column: 10,
  //   name: 'n' }

  console.log('position',consumer.generatedPositionFor({
    source: 'http://example.com/www/js/two.js',
    line: 2,
    column: 10
  }));
  // { line: 2, column: 28 }

  consumer.eachMapping(function (m) {
    // console.log('mapping', m);
  });

  // return computeWhatever();
});


async function downloadSource(projectId, url, revision) {
  /**
   * @type {JSSourceItem}
   */
  let source = new JSSource({projectId, url, revision: 21564216222});

  return await source.load();
}

const ERR_TYPES = {
  accessDenied: 'Access denied'
};


/**
 * Handler for socket messages
 * @param {JSCatcherInput} message
 * @throws {Error} - Access denied
 * @return {Promise}
 */
function handleMessage(message) {

  console.log(message);

  return project.getByToken(message.token)
    .then(foundProject => {
      if (!foundProject) {
        throw new Error(ERR_TYPES.accessDenied);
      }
      return foundProject;
    })
    .then(foundProject => {
      return downloadSource(foundProject._id, message.error_location.file, message.error_location.revision);
    })
    .then(jsSource => {
      if (jsSource.sourceMapBody){
        sourceMap.SourceMapConsumer.with(jsSource.sourceMapBody, null, consumer => {
          // console.log('consumer', consumer);

          console.log('\n\nOriginal position');
          console.log(consumer.originalPositionFor({
            line: message.error_location.line,
            column: message.error_location.col
          }));

          /**
           * @type {{func, file, line, col}[]}
           */
          let parsedStack = stack.parse(message);

          console.log('\n\nStack');
          parsedStack.forEach(item => {
            console.log(consumer.originalPositionFor({
              line: parseInt(item.line),
              column: parseInt(item.col)
            }));
          });

        });
      }
    });

  return;
  let eventGroupPrehashed = message.message;

  message.error_location.full = message.error_location.file + ' -> ' +
    message.error_location.line + ':' +
    message.error_location.col;

  let clientInfo = detect(message.navigator.ua);

  clientInfo.device.width = message.navigator.frame.width;
  clientInfo.device.height = message.navigator.frame.height;

  let event = {
    type          : 'client',
    tag           : 'javascript',
    message       : message.message,
    errorLocation : message.error_location,
    location      : message.location,
    groupHash     : md5(eventGroupPrehashed),
    stack         : stack.parse(message),
    userAgent     : clientInfo,
    time          : Math.floor(message.time / 1000)
  };

  logger.info('Got javascript error from ' + event.location.host);

  project.getByToken(message.token)
    .then( function (foundProject) {
      if (!foundProject) {
        // ws.send(JSON.stringify({type: 'warn', message: 'Access denied'}));
        // ws.close();
        throw new Error(ERR_TYPES.accessDenied);
        return;
      }

      return events.add(foundProject._id, event)
        .then(function () {
          return foundProject;
        });
    })
    .then(function (foundProject) {
      if (!foundProject) {
        return;
      }

      return notifies.send(foundProject, event);
    });
    // .catch( function (e) {
      // logger.log('Error while saving client error ', e);
      // ws.send(JSON.stringify({type: 'error', message: e.message}));
    // });
}

/**
 * Socket connection handler
 * @param ws
 */
function socketConnected (ws) {
  ws.on('message', function (message) {
    console.log('Client catcher received a message: %o', message);

    Promise.resolve(message)
      .then(JSON.parse)
      .then( message => {
        return handleMessage(message);
      })
      .catch( error => {
        ws.send(JSON.stringify({type: 'error', message: error.message}));
        if (error.message === ERR_TYPES.accessDenied){
          ws.close();
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