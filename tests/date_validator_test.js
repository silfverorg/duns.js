var Duns = require('../index');
var should = require('should');

describe('Duns - Date Validator', function() {

  it('Can validate a date', function() {
    should(Duns.validate('2015-01-01', Duns.date())).be.true;
  });

  it('Adds custom method', function(done) {
    should(Duns.date('2015-01-01').custom(function(val) {
      return true;
    }).validate()).be.true;

    should(Duns.date('2015-01-01').custom(function(val) {
      return false;
    }).validate()).be.false;

    should(Duns.string(null).custom(function(val) {
      return true;
    }).validate()).be.false;

    done();
  });

  it('Returns false on no value', function(done) {
    (Duns.date().validate()).should.be.false;
    done();
  });

  it('Can be used inside an array', function() {
    Duns.validate([
      '2015-01-01', '2015-02-01', '2014-12-01',
    ], Duns.array().items([
      Duns.date().max('2015-03-02').min('2014-12-01').partial('date', 1)
    ])).should.be.ok;
  });

  it('Should throw on assert', function(done) {
    (Duns.date(null).assert).should.throw();
    done();
  });

  it('Validates with shorthand notation', function(done) {
    should(Duns.date('2015-01-01').validate()).be.true;
    should(Duns.date(null).validate()).be.false;
    done();
  });

  it('Can be used inside an object', function() {
    //FIXME
  });

  it('Will throw on invalid date', function() {
    should(Duns.validate('This is not a date', Duns.date())).be.false;
  });

  it('Will accept a valid max', function() {
    should(Duns.validate('2015-01-01', Duns.date().max('2015-02-01'))).be.true;
  });

  it('Will throw on invalid max', function() {
    should(Duns.validate('2015-01-01', Duns.date().max('2014-12-01'))).be.false;
  });

  it('Will accept a valid min', function() {
    should(Duns.validate('2015-01-01', Duns.date().min('2014-12-01'))).be.true;
  });

  it('Will throw on invalid min', function() {
    should(Duns.validate('2015-01-01', Duns.date().min('2015-02-01'))).be.false;
  });

  it('Will accept a valid pattern', function() {
    Duns.validate('20150101', Duns.date().pattern('YYYYMMDD')).should.be.ok;
  });

  it('Will throw on invalid formatted date when pattern is not provided', function() {
    Duns.validate('20150101', Duns.date()).should.not.be.ok;
  });

  //Note that pattern YYYYMMDD will validate here since moment ignores non-alphanumeric characters.
  //See http://momentjs.com/docs/#/parsing/string-format/ for more info.
  it('Will throw on invalid pattern', function() {
    Duns.validate('2015-01-01', Duns.date().pattern('DDMMYYYY')).should.not.be.ok;
  });

  describe('Partials', function() {

    it('Can validate partials', function() {
      Duns.validate('2015-01-01', Duns.date().partial('year', 2015)).should.be.ok;
    });

    it('Will throw on invalid partials', function() {
      Duns.validate('2015-01-01', Duns.date().partial('year', 2014)).should.not.be.ok;
    });

    it('Is able to chain partials', function() {
      Duns.validate('2015-01-01', Duns.date().partial('year', 2015).partial('month', 0).partial('date', 1)).should.be.ok;
    });

    it('Will throw if just one partial is invalid', function() {
      Duns.validate('2015-01-01', Duns.date().partial('year', 2015).partial('month', 1)).should.not.be.ok;
    });
  });

  describe('Formats values', function() {

    it('Formats a date', function() {
      Duns.date().returns(function(val) {
        return val + '01';
      }).init('20150101').format().should.eql('2015010101');
    });

    it('Formats a date with shorthand notation', function() {
      Duns.date().returns('YYYYMM').init('2015-01-01').format().should.eql('201501');
    });

    it('Formats a date with shorthand notation, given custom pattern', function() {
      Duns.date().returns('YYYYMM').pattern('YYYYMMDD').init('20150101').format().should.eql('201501');
    });

  });

});
