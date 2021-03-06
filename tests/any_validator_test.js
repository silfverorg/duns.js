var Duns = require('../index');
var should = require('should');

describe('Duns - Any Validator', function() {

  it('Can validate any', function() {
    should(Duns.validate('test', Duns.any())).be.true;
  });

  it('Has invalid method', function() {
    should(Duns.any().invalid(null)).be.true;
    should(Duns.any().invalid(undefined)).be.true;

    should(Duns.any().invalid(10)).be.false;
    should(Duns.any().invalid('10')).be.false;
  });

  it('Returns false on no value', function() {
    (Duns.any().validate()).should.be.false;
  });

  it('Duns main object has assert, validate and invalid method', function(done) {
    var schema = Duns.any();
    should(Duns.validate(100, schema)).be.true;
    should(Duns.assert(100, schema)).be.true;
    should(Duns.invalid(100, schema)).be.false;
    should(Duns.invalid(null, schema)).be.true;
    try {
      should(Duns.assert(null, schema)).be.true;
      done(new Error('Did not assert'));
    } catch (err) {
      // All is good
    }

    done();

  });

  it('Can return failure message', function() {
    var schema = Duns.any().disallow(5);
    schema.validate(5).should.be.false;
    schema.failure.should.be.ok;
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

  it('Returns true on assert', function() {
    (Duns.any().assert(100)).should.be.true;
    (Duns.any().init(100).assert()).should.be.true;
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

  it('Accepts multiple oneOf', function() {
    var schema = Duns.any().oneOf([
      Duns.number().only(1337),
      Duns.string().only('1337'),
    ]);

    Duns.validate('1337', schema).should.be.true;
    schema.validate(1337).should.be.true;

    schema.validate(true).should.be.false;
    schema.validate(false).should.be.false;
    schema.validate('133').should.be.false;
    schema.validate(133).should.be.false;
  });

  it('Can format value', function() {
    var schema = Duns.any().returns(function(val) {
      return val * 2;
    });

    should(schema.init(5).format(10)).be.eql(20);
    should(schema.format(20)).be.eql(40);

  });

  it('Can validate only', function() {
    var schema = Duns.any().only(null);
    Duns.validate(null, schema).should.be.true;
    Duns.validate(undefined, schema).should.be.false;
    Duns.validate(1, schema).should.be.false;
    Duns.validate(true, schema).should.be.false;
    Duns.validate(false, schema).should.be.false;
    Duns.validate('true', schema).should.be.false;
  });

  it('Can validate multiple only', function() {
    var schema = Duns.any().only('1337', 1337);
    schema.validate(1337).should.be.true;
    schema.validate('1337').should.be.true;
    schema.validate(undefined).should.be.false;
    schema.validate(null).should.be.false;
    schema.validate('1336').should.be.false;
    schema.validate(true).should.be.false;
    schema.validate(false).should.be.false;
  });

  it('Can validate undefined only value', function() {
    var schema = Duns.any().only(undefined);
    schema.validate(undefined).should.be.true;
    schema.validate(null).should.be.false;
    schema.validate(true).should.be.false;
  });

});
