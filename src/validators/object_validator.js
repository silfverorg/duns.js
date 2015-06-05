var _ = require('underscore');
var DunsSchema = require('../duns_schema');

var ObjectValidator = {
    type : 'Duns-object-validator',
    _clear : function() {
        this.props = {
        };
        return this;
    },
    validate : function(param) {
        if( _(param).isObject() == false)
            throw new Error('Not object');
        return true;
    },
    keys : function(keys) {
        var dschema = Object.create(DunsSchema);
        dschema.init();
        _(keys).keys().map(function(key) {
            var val = keys[key];
            dschema.build(key,val);
        });
        return dschema;
    }
};

module.exports = ObjectValidator;
