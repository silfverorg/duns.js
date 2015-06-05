var Duns = require('./src/index');

var TestSchema = Duns.schema({
    name      : Duns.string().maxlen(10).minlen(5).length(6),
    email     : Duns.string().email(),
    something : Duns.string().allow('')
});
var testobj  = {
    name : 'niklas',
    email : 'silfverstrom@gmail.com',
    something : ''
};
var a = Duns.validate(testobj, TestSchema);


var test = { deal : { ninja : 'hej' } };
var test2 = { deal : { ninja : 100 } };
var f = Duns.schema({ 
    deal : Duns.schema({
        ninja : Duns.string()
    })
});
console.log(Duns.validate(test, f) );
console.log(Duns.validate(test2, f) );


