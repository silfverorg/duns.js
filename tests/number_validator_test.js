var Duns   = require('../index');
var should = require('should');

describe('NumberValidator - validates numbers', function() {
  it('Validates number', function(done) {

    should(Duns.validate(100, Duns.number())).be.true;
    should(Duns.validate('100', Duns.number())).be.falsy;
    should(Duns.validate([], Duns.number())).be.falsy;
    should(Duns.validate({}, Duns.number())).be.falsy;
    done();
  });

  it('Returns false on no value', function(done) {
    (Duns.number().validate()).should.be.false;
    done();
  });

  it('Should throw on assert', function(done) {
    (Duns.number('100').assert).should.throw();
    done();
  });

  it('Validates number extensions', function(done) {

    //This functionality is not supported atm.
    /*
    Duns.number().extend({
      between: function(param, min, max) {
        if (param < min) return false;
        if (param > max) return false;
        return true;
      },

      sqrtOfThree: function(param) {
        if (Math.sqrt(param) !== 3) return false;
        return true;
      },
    });
    should(Duns.validate(110, Duns.number().between(100, 200))).eql(true, 'Should be between 100-200');
    should(Duns.validate(90, Duns.number().between(100, 200))).eql(false, 'Not valid according to custom');
    should(Duns.validate(90, Duns.number().between(0, 100).sqrtOfThree()))
        .eql(false, 'Should Not sqrt of three');
    should(Duns.validate(9, Duns.number().between(0, 100).sqrtOfThree()))
        .eql(true, 'Should be sqrt of three');
    */
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

  it('validates min', function(done) {
    should(Duns.number(100).min(90).validate()).be.true;
    should(Duns.number(100).min(110).validate()).be.false;
    done();
  });

  it('validates greater', function(done) {
    should(Duns.number(100).greater(90).validate()).be.true;
    should(Duns.number(100).greater(110).validate()).be.false;
    done();
  });

  it('validates less', function(done) {
    should(Duns.number(100).less(110).validate()).be.true;
    should(Duns.number(100).less(90).validate()).be.false;
    done();
  });

  it('validates positive', function(done) {
    should(Duns.number(100).positive().validate()).be.true;
    should(Duns.number(-100).positive().validate()).be.false;
    done();
  });

  it('validates negative', function(done) {
    should(Duns.number(-100).negative().validate()).be.true;
    should(Duns.number(100).negative().validate()).be.false;
    done();
  });

});
