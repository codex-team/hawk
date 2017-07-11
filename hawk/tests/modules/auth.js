/**
 * Testing Auth modules
 * Every public function must have 3 or more cases
 */
let auth = require('../../modules/auth');

let chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

describe('MODULE.AUTH', function() {

  /**
   * Function #Check
   * checks user existance by cookies
   * @see /modules/auth.js#check
   */
  describe('#Check function', function() {

    it('testing fake cookies', function() {

        /** setting random hash and id */
        let user_id = '5953d6cf3e89e4000f6eade4',
            user_hash = '35ba436493f5a2cbb73071d1df31cfe2027ad2c338329d5d389acfdc3ec2071c';
            cookies = {
              user_id, user_hash
            };

        let result = auth.check(cookies);

    });

  });

  /**
   * Function #generateHash
   * generates hash from string. Uses sha256 method
   * @see /modules/auth.js#generateHash
   */
  describe('#generateHash function', function() {

    let string,
        result;

    it('make hash from string `Hello, Hawk`', function() {

        string = 'Hello, Hawk';
        result = auth.generateHash(string);

        expect(result).to.equal('3f375c925483cbb8dc500a52180d24af5408815202b2e17104f5995354a36cd2');
    });

    it ('make hash from string `Codex-Team`', function() {

      string = 'Codex-Team';
      result = auth.generateHash(string);

      result.should.be.equal('a49170a667e72ef4cb99800db2f4ec6c2181884842e55879d019f5dd13e5c8d3');

    });

    it ('this test must fail... hash from Hawk mustn`t be `dflgdkfg`', function() {

      string = 'Hawk';
      result = auth.generateHash(string);

      result.should.not.equal('Bgig;dflgdkfg');

    });

  })

});
