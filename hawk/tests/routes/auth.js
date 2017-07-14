require('dotenv').config();

let app = process.env.PROTOCOL + '://' + process.env.HOST_NAME + ':' + process.env.PORT;

let chai = require('chai'),
    chaiHttp = require('chai-http'),
    expect = chai.expect,
    assert = chai.assert,
    should = chai.should();

chai.use(chaiHttp);

describe('Testing Routes: /login page', function() {

  /**
   * Open Login page
   * 1) Request must return page with 200 status
   * 2) Response mustn't contain any errors
   * 3) Expect text/html content-type
   */
  it ('Request /login page', function(done) {

      chai.request(app)
        .get('/login')
        .end(function(err, res) {

            assert.equal(res.status, 200, 'Request returns page with 200 status')
            expect(res.headers['content-type']).to.be.equal('text/html; charset=utf-8');
            expect(err).to.be.null;
            done();

        });

  });

  /**
   * User gets login page with correct cookies:
   * If user has correct data, he must be redirected to /garage
   */
  it ('Case 1 #GET: User has correct `user_id` and `user_hash` cookies. Expect redirect to /garage without errors', function(done) {

    chai.request(app)
      .get('/login')
      .set('Cookie', '_csrf=i1YNofMeM05axYRn52xpXQXr; user_id=5953d6cf3e89e4000f6eade4; user_hash=35ba436493f5a2cbb73071d1df31cfe2027ad2c338329d5d389acfdc3ec2071c')
      .end(function(err, res) {

        expect(res.redirects[0]).to.be.equal(app + '/garage');
        expect(err).to.be.null;
        done();

      });

  });

  /**
   * If user doesn't have any cookie, he must see login page with form
   * content-type must be text/html
   */
  it ('Case 2 #GET: User does not have `user_id` and `user_hash` cookies. Expect current page content without errors', function(done) {

    chai.request(app)
      .get('/login')
      .end(function(err, res) {

        assert.equal(res.status, 200, 'Request returns page with 200 status')
        assert.equal(res.redirects.length, 0, 'see login form');
        expect(res.headers['content-type']).to.be.equal('text/html; charset=utf-8');
        expect(err).to.be.null;

        done();

      });

  });

  /**
   * After authentification user must be redirected to the /garage
   * content-type: text/html
   */
  it ('Case 3 #POST: Send correct `email` and `password` to sign in. Expect redirect to /garage page', function(done) {

    let email    = 'morgan-_-95@mail.ru',
        password = '22mrhpvi';

    chai.request(app)
      .post('/login')
      .send({
        'email' : email,
        'password' : password
      })
      .end(function(err, res) {

          expect(res.redirects[0]).to.be.equal(app + '/garage');
          expect(err).to.be.null;
          done();

      });

  });

  /**
   * If POST data is not correct, show 'Try again' page
   * content-type: text/html
   */
  it ('Case 4 #POST: Send incorrect `email` and `password`. Expect to see current /login page without errors', function(done) {

    let email    = 'morgan-_-95@mail.ru',
        password = 'somepassword';

    chai.request(app)
      .post('/login')
      .send({
        'email' : email,
        'password' : password
      })
      .end(function(err, res) {

          assert.equal(res.status, 200, 'Request returns page with 200 status')
          assert.equal(res.redirects.length, 0, 'see login form');
          expect(res.headers['content-type']).to.be.equal('text/html; charset=utf-8');
          expect(err).to.be.null;
          done();

      });

  });

  /**
   * Must refresh page or show login page
   * content-type: text/html
   */
  it ('Case 5 #POST: Send empty `email` and `password`. Expect to see /login page', function(done) {

    chai.request(app)
      .post('/login')
      .send({
        'email' : null,
        'password' : null
      })
      .end(function(err, res) {

          assert.equal(res.status, 200, 'Request returns page with 200 status')
          assert.equal(res.redirects.length, 0, 'see login form');
          expect(res.headers['content-type']).to.be.equal('text/html; charset=utf-8');
          expect(err).to.be.null;
          done();

      });

  });

});
