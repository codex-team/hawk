require('dotenv').config();

let app = process.env.SERVER_URL;

let chai = require('chai'),
    chaiHttp = require('chai-http'),
    expect = chai.expect,
    assert = chai.assert,
    should = chai.should();

chai.use(chaiHttp);

describe('Testing Routes: /garage page', function() {
});
