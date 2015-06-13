var Duns   = require('../index');
var should = require('should');

describe('Duns - validator', function() {
  it('Validates basic', function(done) {
    done();
  });

  it('Validates string', function(done) {
    should(Duns.validate('test', Duns.string())).be.true;
    should(Duns.validate(100, Duns.string())).be.falsy;
    should(Duns.validate({}, Duns.string())).be.falsy;

    done();
  });

  it('Validates string().oneOf', function(done) {

    //Test valid cases
    should(Duns.validate('test1',
        Duns.string().oneOf('test1', 'test2')
    )).be.eql(true, 'should match test1');
    should(Duns.validate('test2',
        Duns.string().oneOf('test1', 'test2')
    )).be.eql(true, 'should match test2');

    //Test invalid valid cases
    should(Duns.validate('nomatch',
        Duns.string().oneOf('test1', 'test2')
    )).be.eql(false, 'should not match any case');

    done();
  });

  it('Validates number', function(done) {

    should(Duns.validate(100, Duns.number())).be.true;
    should(Duns.validate('100', Duns.number())).be.falsy;
    should(Duns.validate([], Duns.number())).be.falsy;
    should(Duns.validate({}, Duns.number())).be.falsy;
    done();
  });

  it('Validates number extensions', function(done) {
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
