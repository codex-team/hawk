let app = 'http://hawk.io:3000';

let chai = require('chai'),
    chaiHttp = require('chai-http'),
    expect = chai.expect,
    should = chai.should();

chai.use(chaiHttp);

describe('/login page', function() {

  /**
   * Open Login page
   */
  it ('Check /login page', function(done) {

      chai.request(app)
        .get('/login')
        .end(function(err, res) {

            expect(res.status).to.equal(200);
            expect(err).to.be.null;
            done();

        });

  });

  it ('Test login page. Case 1: When user has correct cookies', function(done) {

    chai.request(app)
      .get('/login')
      .end(function(err, res) {
        // console.log("error", err);
        // console.log("response", res);

        done();
      });

  });

  it ('Test login page. Case 2: When user has not cookies', function(done) {

    chai.request(app)
      .get('/login')
      .end(function(err, res) {

        done();
      });

  });

  it ('Test login page. Case 3: When data is empty', function(done) {
    done();
  });

  it ('Test POST request. Send correct data', function(done) {
    done();
  });

  it ('Test POST request. Send incorrect data', function(done) {
    done();
  });

  it ('Test POST request. Send empty data', function(done) {
    done();
  });

});
