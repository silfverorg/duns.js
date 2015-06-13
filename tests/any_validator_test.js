var Duns = require('../index');
var should = require('should');

describe('Duns - Date Validator', function() {

  it('Can validate any', function() {
    should(Duns.validate('test', Duns.any())).be.true;
  });

  it('null and undefined and false should not match any', function() {
    should(Duns.validate(null, Duns.any())).be.false;
    should(Duns.validate(undefined, Duns.any())).be.false;
  });

  it('Can disallow values', function() {
    should(Duns.validate('1', Duns.any().disallow('1'))).be.false;

    // disallow another value, and make sure it validates.
    should(Duns.validate('1', Duns.any().disallow('2'))).be.true;
  });

  it('Can disallow multiple values', function() {
    var schema = Duns.any().disallow([
      '1',
      '2',
      '3',
      4,
    ]);
    should(Duns.validate('1', schema)).be.false;
    should(Duns.validate('2', schema)).be.false;
    should(Duns.validate('3', schema)).be.false;
    should(Duns.validate(4, schema)).be.false;

    //Acceptable
    should(Duns.validate(5, schema)).be.true;

    //Disallow another value.
    schema.disallow(5);
    should(Duns.validate(5, schema)).be.false;

  });

});
