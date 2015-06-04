var Duns = require('./index');

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
Duns.validate(testobj, TestSchema);

