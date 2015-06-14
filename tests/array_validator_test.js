var Duns   = require('../index');
var should = require('should');

describe('Arrayvalidator - validates array objects', function() {
  it('Validates min', function(done) {
    should(Duns.array([100]).min(1).validate()).be.true;
    should(Duns.array([100]).min(2).validate()).be.false;
    done();
  });

  it('Adds custom method', function(done) {
    should(Duns.array([100]).custom(function(val) {
      return true;
    }).validate()).be.true;

    should(Duns.array([100]).custom(function(val) {
      return false;
    }).validate()).be.false;

    should(Duns.array(100).custom(function(val) {
      return true;
    }).validate()).be.false;

    done();
  });

  it('Returns false on no value', function(done) {
    (Duns.array().validate()).should.be.false;
    done();
  });

  it('Validates max', function(done) {
    should(Duns.array([100]).max(1).validate()).be.true;
    should(Duns.array([
    100,
    200,
    ]).max(1).validate()).be.false;
    done();
  });

  it('Should throw on assert', function(done) {
    (Duns.array(100).assert).should.throw();
    done();
  });

  it('Validates length', function(done) {
    should(Duns.array([100]).length(1).validate()).be.true;
    should(Duns.array([
    100,
    200,
    ]).length(2).validate()).be.true;

    should(Duns.array([
    100,
    200,
    ]).length(3).validate()).be.false;
    done();
  });

  it('Validates array', function(done) {

    should(Duns.validate([100], Duns.array())).be.true;
    should(Duns.validate([100], Duns.array())).be.true;

    should(Duns.validate([100],
        Duns.array().items([Duns.number()])
    )).be.true;
    should(Duns.validate([
        100, 200, 300,
      ],
      Duns.array().items([Duns.number()])
    )).be.true;
    should(Duns.validate([100],
        Duns.array().items(
          [
            Duns.string(), Duns.number(),
          ]
        )
    )).be.true;
    should(Duns.validate(['100'],
        Duns.array().items(
          [
            Duns.string(), Duns.number(), Duns.array(),
          ]
        )
    )).be.true;
    should(Duns.validate(
        [
          100, 'test',
        ],
        Duns.array().items(
          [
            Duns.string(), Duns.number(),
          ]
        )
    )).be.true;
    should(Duns.validate([[]],
        Duns.array().items([Duns.array()])
    )).be.true;

    should(Duns.validate([100],
        Duns.array().items([Duns.array()])
    )).be.false;

    should(Duns.validate(
      [
        100, 'test',
      ],
      Duns.array().items([Duns.number()])
    )).be.false;
    should(Duns.validate(
      [
        100, 'test',
      ],
      Duns.array().items([Duns.string()])
    )).eql(false, 'should match one');

    should(Duns.validate([[100]],
        Duns.array().items([Duns.string()])
    )).eql(false, '[100] is not array of strings');

    should(Duns.validate(100, Duns.array())).eql(false, '100 is not array');
    done();
  });

  it('Validates format for arrays', function(done) {

    var it = [
      100,
      200,
    ];
    var Schema = Duns.array().returns(function(item) {
      return item * 2;
    }).init(it);

    var val = Schema.format();
    should(val).eql(
    [
      200,
      400,
    ], 'returns each item times two.');

    done();
  });
});
