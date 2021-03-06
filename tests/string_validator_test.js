var Duns   = require('../index');
var should = require('should');

describe('Stringvalidator - validates string objects', function() {

  it('Validates string', function(done) {
    should(Duns.validate('test', Duns.string())).be.true;
    should(Duns.validate(100, Duns.string())).be.falsy;
    should(Duns.validate({}, Duns.string())).be.falsy;

    done();
  });

  it('Adds custom method', function(done) {
    should(Duns.string('100').custom(function(val) {
      return true;
    }).validate()).be.true;

    should(Duns.string('100').custom(function(val) {
      return false;
    }).validate()).be.false;

    should(Duns.string(100).custom(function(val) {
      return true;
    }).validate()).be.false;

    done();
  });

  it('Fails on empty data', function(done) {
    (Duns.string().validate()).should.be.false;
    done();
  });

  it('Should throw on assert', function(done) {
    (Duns.string(100).assert).should.throw();
    (Duns.string().assert).should.throw();
    done();
  });

  describe('Can validate oneOf', function() {
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

    it('Handles arrays correctly', function() {
      var schema = Duns.string().oneOf([
        '1', '2', '3',
      ]);
      should(schema.validate('1')).be.true;

      should(schema.validate(1)).be.false;
      should(schema.validate('somethingelse')).be.false;
    });

  });

  it('Validates format for strings', function(done) {

    var Schema = Duns.string().returns(function(val) {
      return val + '!!';
    }).init('100');

    var val = Schema.format();
    should(val).eql('100!!', 'formats string correctly');

    done();
  });

  it('Validates maxlength', function(done) {
    should(Duns.string('test').maxlen(5).validate()).be.true;
    should(Duns.string('test').maxlen(2).validate()).be.false;
    done();
  });

  it('Validates minlength', function(done) {
    should(Duns.string('test').minlen(2).validate()).be.true;
    should(Duns.string('test').minlen(5).validate()).be.false;
    done();
  });

  it('Validates exact length', function(done) {
    should(Duns.string('test').length(4).validate()).be.true;
    should(Duns.string('test').length(5).validate()).be.false;
    done();
  });

  it('Validates email', function(done) {
    should(Duns.string('test@test.com').email().validate()).be.true;
    should(Duns.string('test').email().validate()).be.false;
    done();
  });

  it('Validates allow', function(done) {
    should(Duns.string('').allow('').validate()).be.true;
    should(Duns.string('').validate()).be.false;
    done();
  });

  it('Validates deny', function(done) {
    should(Duns.string('something').deny('test').validate()).be.true;
    should(Duns.string('test').deny('test').validate()).be.false;
    done();
  });

  describe('Can validate objects with values', function() {
    it('Can validate directly on schema', function(done) {
      should(Duns.string().validate('test')).be.true;
      done();
    });

    it('Can validate using init method value', function(done) {
      should(Duns.string().init('test').validate()).be.true;
      done();
    });

    it('Can validate using bound value from constructor ', function(done) {
      should(Duns.string('test').validate()).be.true;
      done();
    });

    it('Validates using bound value, and nested methods', function(done) {
      should(Duns.string('test').maxlen(5).validate()).be.true;
      should(Duns.string('test').maxlen(2).validate()).be.false;
      done();
    });

  });

  it('Can validate a regex', function() {
    should(Duns.string('foo').match(/^fo+$/).validate()).be.true;

    should(Duns.string('bar').match(/^fo+$/).validate()).be.false;
    should(Duns.string('notacat').match(/^cat$/).validate()).be.false;
    should(Duns.string('notacat').match(/cat$/).validate()).be.true;

    should(Duns.string('foobar').match('foo').validate()).be.true;
    should(Duns.string('foo').match('').validate()).be.true;

    should(Duns.string('Foo').match('foo').validate()).be.false;
    should(Duns.string('Foo').match('/foo/i').validate()).be.false;
    should(Duns.string('Foo').match(/foo/).validate()).be.false;
    should(Duns.string('Foo').match(/foo/i).validate()).be.true;
  });

  it('Handles invalid regex values', function() {
    //These should all be true, since match will not allow the match values.
    //Making validation only check for typeof string
    should(Duns.string('foo').match(undefined).validate()).be.true;
    should(Duns.string('foo').match(null).validate()).be.true;
    should(Duns.string('foo').match(0).validate()).be.true;
    should(Duns.string('foo').match(true).validate()).be.true;
    should(Duns.string('foo').match(false).validate()).be.true;

  });

  it('Extends string', function(done) {
    var extensionSchema = Duns.string().extend({
      is42: function(val) {
        return val === '42';
      }
    });

    should(extensionSchema.is42().validate('42')).be.true;
    should(extensionSchema.is42().validate('100')).be.false;

    done();
  });

});
