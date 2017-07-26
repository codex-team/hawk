let express = require('express');
let router = express.Router();

let login = require('./login');
let logout = require('./logout');
let join = require('./join');
let reset = require('./reset');
let recover = require('./recover');

router.use(login);
router.use(login);
router.use(login);
router.use(reset);
router.use(recover);
