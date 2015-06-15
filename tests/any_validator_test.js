var Duns = require('../index');
var should = require('should');

describe('Duns - Any Validator', function() {

  it('Can validate any', function() {
    should(Duns.validate('test', Duns.any())).be.true;
  });

  it('Returns false on no value', function(done) {
    (Duns.any().validate()).should.be.false;
    done();
  });

  describe('Extensions', function() {
    it('Extends any', function(done) {
      var extensionSchema = Duns.any().extend({
        is42: function(val) {
          return val === 42;
        }
      });

      should(extensionSchema.is42().validate(42)).be.true;
      should(extensionSchema.is42().validate(100)).be.false;

      done();
    });

    it('Returns constraints to extended method', function(done) {
      var extensionSchema = Duns.any().extend({
        isBetween: function(val, min, max) {
          return val < max && val > min;
        }
      });

      should(extensionSchema.isBetween(50, 100).validate(60)).be.true;
      should(extensionSchema.isBetween(50, 100).validate(40)).be.false;
      should(extensionSchema.isBetween(50, 100).validate(110)).be.false;

      done();
    });

    it('Extensions are per schema basis', function(done) {
      var extensionSchema = Duns.any().extend({
        is42: function(val) {
          return val === 42;
        }
      });

      should(extensionSchema.is42().validate(42)).be.true;

      var cleanSchema = Duns.any();
      should(cleanSchema.is42).be.undefined;

      done();
    });

  })

  it('Uses shorthand notation', function(done) {
    should(Duns.any(100).validate()).be.true;
    done();
  });

  it('Should throw on assert', function(done) {
    (Duns.any(undefined).assert).should.throw();
    done();
  });

  it('Adds custom method', function(done) {
    should(Duns.any(100).custom(function(val) {
      return true;
    }).validate()).be.true;

    should(Duns.any(100).custom(function(val) {
      return false;
    }).validate()).be.false;

    done();
  });

  it('null and undefined and false should not match any', function() {
    should(Duns.validate(null, Duns.any())).be.false;
    should(Duns.validate(undefined, Duns.any())).be.false;
  });

  it('Can disallow values', function() {
    should(Duns.validate('1', Duns.any().disallow('1'))).be.false;

    // disallow another value, and make sure it validates.
    //should(Duns.validate('1', Duns.any().disallow('2'))).be.true;
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

  it('Always accept whitelisted values', function() {
    should(Duns.validate(null, Duns.any().allow(null))).be.true;
    should(Duns.validate(undefined, Duns.any().allow(undefined))).be.true;

    should(Duns.validate(1, Duns.any().disallow(1).allow(1))).be.true;
  });

  it('Accepts oneOf', function() {
    var schema = Duns.any().oneOf(Duns.number());
    should(Duns.validate(10, schema)).be.true;

    should(Duns.validate(null, schema)).be.false;
    should(Duns.validate('10', schema)).be.false;
  });

});
