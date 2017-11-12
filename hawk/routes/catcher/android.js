let express  = require('express');
let router = express.Router();
let events   = require('../../models/events');
let notifies = require('../../models/notifies');
let crypto = require('crypto');
let project = require('../../models/project');

let md5 = function (input) {
    return crypto.createHash('md5').update(input, 'utf8').digest('hex');
};

/**
 * Server-side receiver for Java's exceptions.
 * It takes followings json params in request:
 *
 * @param req
 * @param res
 */
let getJavaErrors = function (req, res) {
    let request = req.body,
        eventGroupPrehashed = request.message;

    let event = {
        type: 'java android',
        tag: 'fatal',
        token: request.token,
        message: request.message,
        deviceInfo: {
            brand: request.brand,
            device: request.device,
            model: request.model,
            id: request.id,
            product: request.product,
            SDK: request.SDK,
            release: request.release,
            incremental: request.incremental
        },
        errorLocation: request.errorLocation,
        stack: request.stack,
        groupHash: md5(eventGroupPrehashed),
        time: request.time
    };

    project.getByToken(event.token)
        .then( function (foundProject) {
            if (!foundProject) {
                res.sendStatus(403);
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

            notifies.send(foundProject, event);

            res.sendStatus(200);
        })
        .catch( function () {
            res.sendStatus(500);
        });
};

/* GET java errors. */
router.post('/javaAndroid', getJavaErrors);

module.exports = router;
