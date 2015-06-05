var _ = require('underscore');

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

    }
};

module.exports = ObjectValidator;
