var Duns   = require('../index');
var should = require('should');

describe('ObjectValidator - validates objects', function() {
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

  it('Returns false on no value', function(done) {
    (Duns.object().validate()).should.be.false;
    done();
  });

  it('Should throw on assert', function(done) {
    (Duns.object(100).assert).should.throw();
    done();
  });

  it('Can validate using shorthand syntax', function(done) {
    should(Duns.object({
      age: 100,
    }).keys({
      age: Duns.number(),
    }).validate()).be.true;
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
