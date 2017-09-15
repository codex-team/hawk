let events   = require('../../models/events');
let notifies = require('../../models/notifies');
let WebSocket = require('ws');
let Crypto = require('crypto');
let stack = require('../../modules/stack');
let project = require('../../models/project');

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

let connection = function (ws) {
  function getClientErrors(message) {
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
      stack         : stack.parse(message),
      groupHash     : md5(eventGroupPrehashed),
      userAgent     : clientInfo,
      time          : Math.floor(message.time / 1000)
    };

    logger.info('Got javascript error from ' + event.location.host);

    project.getByToken(message.token)
      .then( function (foundProject) {
        if (!foundProject) {
          ws.send(JSON.stringify({type: 'warn', message: 'Access denied'}));
          ws.close();
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
      })
      .catch( function (e) {
        logger.log('Error while saving client error ', e);
        ws.send(JSON.stringify({type: 'error', message: e.message}));
      });
  }

  let receiveMessage = function (message) {
    console.log('Client catcher recieved a message: %o', message);

    message = JSON.parse(message);
    getClientErrors(message);
  };

  ws.on('message', receiveMessage);
};

receiver.on('connection', connection);
