var Duns = require('../index');
var should = require('should');

describe('Duns - Date Validator', function() {

  it('Can validate a date', function() {
    should(Duns.validate('2015-01-01', Duns.date())).be.true;
  });

  it('Can be used inside an array', function() {
    Duns.validate([
      '2015-01-01', '2015-02-01', '2014-12-01',
    ], Duns.array().items([
      Duns.date().max('2015-03-02').min('2014-12-01').partial('date', 1)
    ])).should.be.ok;
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

  it('Will accept a valid format', function() {
    Duns.validate('20150101', Duns.date().format('YYYYMMDD')).should.be.ok;
  });

  it('Will throw on invalid formatted date when format is not provided', function() {
    Duns.validate('20150101', Duns.date()).should.not.be.ok;
  });

  //Note that format YYYYMMDD will validate here since moment ignores non-alphanumeric characters.
  //See http://momentjs.com/docs/#/parsing/string-format/ for more info.
  it('Will throw on invalid format', function() {
    Duns.validate('2015-01-01', Duns.date().format('DDMMYYYY')).should.not.be.ok;
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

});
