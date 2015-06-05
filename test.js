var Duns   = require('./index');
var should = require('should');

describe('Duns - validator', function() {
    it('Validates basic', function(done) {
        done();
    });
    it('Validates string', function(done) {

        should(Duns.validate('test', Duns.string()) ).be.true;
        should(Duns.validate(100, Duns.string()) ).be.falsy;
        should(Duns.validate({}, Duns.string()) ).be.falsy;
        done();
    });
    it('Validates number', function(done) {

        should(Duns.validate(100, Duns.number()) ).be.true;
        should(Duns.validate('100', Duns.number()) ).be.falsy;
        should(Duns.validate([], Duns.number()) ).be.falsy;
        should(Duns.validate({}, Duns.number()) ).be.falsy;
        done();
    });
    it('Validates array', function(done) {

        should(Duns.validate([100], Duns.array()) ).be.true;
        should(Duns.validate([100], Duns.array())).be.true;

        should(Duns.validate([100], 
            Duns.array().items([Duns.number()])
        )).be.true;
        should(Duns.validate([100,200,300], 
            Duns.array().items([Duns.number()])
        )).be.true;
        should(Duns.validate([100], 
            Duns.array().items([Duns.string(),Duns.number()])
        )).be.true;
        should(Duns.validate(['100'], 
            Duns.array().items([Duns.string(),Duns.number(),Duns.array()])
        )).be.true;
        should(Duns.validate([100,'test'], 
            Duns.array().items([Duns.string(),Duns.number()])
        )).be.true;
        should(Duns.validate([ [] ], 
            Duns.array().items([Duns.array()])
        )).be.true;

        should(Duns.validate([ 100 ], 
            Duns.array().items([Duns.array()])
        )).be.false;

        should(Duns.validate([100,'test'], 
            Duns.array().items([Duns.number()])
        )).be.false;
        should(Duns.validate([100,'test'], 
            Duns.array().items([Duns.string()])
        )).eql(false, 'should match one');

        should(Duns.validate([ [100] ], 
            Duns.array().items([Duns.string()])
        )).eql(false, '[100] is not array of strings');

        should(Duns.validate(100, Duns.array()) ).eql(false,'100 is not array');
       
        done();
    });
});
