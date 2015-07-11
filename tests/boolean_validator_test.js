var Duns   = require('../index');
var should = require('should');

describe('Duns.bool() - boolean type', function() {

  it('Has bool type', function() {
    var schema = Duns.bool();
    should(schema.validate(true)).eql(true);
    should(schema.validate(false)).eql(true);
  });

  it('Does not validate none true values', function() {
    var schema = Duns.bool();
    should(schema.validate(0)).eql(false);
    should(schema.validate('0')).eql(false);
    should(schema.validate('false')).eql(false);
    should(schema.validate('true')).eql(false);
    should(schema.validate(1)).eql(false);
  });

  it('has method mustBeTrue', function() {
    var schema = Duns.bool().mustBeTrue();
    should(schema.validate(true)).eql(true)
    should(schema.validate(false)).eql(false)
  });

  it('has method mustBeFalse', function() {
    var schema = Duns.bool().mustBeFalse();
    should(schema.validate(false)).eql(true)
    should(schema.validate(true)).eql(false)
  });

});
