var Duns   = require('../index');
var should = require('should');

describe('Duns - validator', function() {
  it('Validates basic', function(done) {
    done();
  });

  it('Validates format for strings', function(done) {

    var Schema = Duns.string().returns(function(val) {
      return val + '!!';
    }).init('100');

    var val = Schema.format();
    should(val).eql('100!!', 'formats string correctly');

    done();
  });

  it('Validates format for numbers', function(done) {

    var Schema = Duns.number().returns(function(val) {
      return val * 2;
    }).init(100);

    var val = Schema.format();
    should(val).eql(200, 'formats number correctly');

    done();
  });

  it('Validates objects', function(done) {

    var Schema = Duns.object().keys({
      age: Duns.number(),
      name: Duns.string(),
    });

    var okObj = {
      age: 10,
      name: 'niklas',
    };
    var falseObj = {
      age: 'niklas',
      name: 'niklas',
    };

    var res      = Duns.validate(okObj, Schema);
    var resfalse = Duns.validate(falseObj, Schema);
    should(res).be.true;
    should(resfalse).be.false;

    done();
  });

  it('Validates format for objects', function(done) {

    var Schema = Duns.object().keys({
      age: Duns.number().returns(function(val) {
        return val * 2;
      }),

      name: Duns.string().returns(function(val) {
        return val + '!!';
      }),

      items: Duns.array().returns(function(val) {
        return val * 2;
      }),
    });

    var okObj = {
      age: 10,
      name: 'niklas',
      items: [
        100,
        200,
      ],
    };

    var val = Schema.init(okObj).format();

    should(val).eql(
    {
      age: 20,
      name: 'niklas!!',
      items: [
        200,
        400,
      ],
    }, 'Returns all values formatted');

    done();
  });

});
