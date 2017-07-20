/**
 * Testing Auth modules
 * Every public function must have 3 or more cases
 */
let auth = require('../../modules/auth');

require('dotenv').config();

let chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

describe('MODULE.AUTH', function () {
  /**
   * Function auth.check.
   * call function with fake and normal cookies
   * @see /modules/auth.js#check
   */
  describe('Testing auth.check()', function () {
    it('Call with fake \'user_id\' or \'user_hash\' cookies. Expect 0', function () {
      /** setting random hash and id */
      let user_id = '35ba436493f5a2cbb73071d1dfs',
        user_hash = '35ba436493f5a2cbb73071d1df31cfe2027ad2c338329d5d389acfdc3ec2071c';

      cookies = {
        user_id, user_hash
      };

      let result = auth.check(cookies);

      expect(result).to.be.equal(0);
    });

    it('Call with normal \'user_id\' or \'user_hash\' cookies. Expect user\'s id', function () {
      /** setting regular hash and id */
      let user_id = '5953d6cf3e89e4000f6eade4',
        user_hash = '35ba436493f5a2cbb73071d1df31cfe2027ad2c338329d5d389acfdc3ec2071c';

      cookies = {
        user_id, user_hash
      };

      let result = auth.check(cookies);

      expect(result).to.be.equal(user_id);
    });
  });

  /**
   * Function auth.generateHash
   * Call with some string to generate hash
   * @see /modules/auth.js#generateHash
   */
  describe('Testing auth.generateHash()', function () {
    let string,
      result;

    it('Call with string `Hello, Hawk`. Expect `14efe23cd58c36d3a2da96f17144ff69d01402133f3cf2da96a24f4d6cf71a0f`', function () {
      string = 'Hello, Hawk';
      result = auth.generateHash(string);
      expect(result).to.equal('14efe23cd58c36d3a2da96f17144ff69d01402133f3cf2da96a24f4d6cf71a0f');
    });
  });
});
