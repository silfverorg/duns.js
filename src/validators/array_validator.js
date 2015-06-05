var _ = require('underscore');
var DunsSchema = require('../duns_schema');

var ArrayValidator = {
    type : 'Duns-array-validator',
    _clear : function() {
        this.props = {
            min : null,
            max : null,
            length : null,
            items : null,
        };
        return this;
    },
    min : function(s) {
        this.props.min = s;
        return this;
    },
    max : function(s) {
        this.props.max = s;
        return this;
    },
    length : function(s) {
        this.props.length = s;
        return this;
    },
    items : function(items) {
        this.props.items = items;
        return this;
    },
    validate : function(param) {
        var props = this.props;
        if( _(param).isArray() == false)
            throw new Error('Not array');
        if(props.min && param.length < props.min)
            throw new Error('Length not large enough');
        if(props.max && param.length > props.max)
            throw new Error('Length larger than max');
        if(props.length && param.length !== props.length)
            throw new Error('Length does not equal schema length');
        if(props.items) {
            _(param).each(function(item) {
                var oneOf = false;
                _(props.items).each(function(schema) {
                    try {
                        oneOf = schema.validate(item);
                    } catch(err) {}
                });
                if(oneOf === false) {
                    throw new Error('Did not match ');
                }
            });
        }
        return true;
    },
};

module.exports = ArrayValidator;
