var _ = require('underscore');
var DunsSchema = require('../duns_schema');

var ArrayValidator = function() {};
ArrayValidator.prototype = {
    type : 'Duns-array-validator',
    _clear : function() {
        this.props = Object.create({
            min : 0,
            max : null,
            le : null,
            items : null,
        });
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
        this.props.le = s;
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
        if(props.le && param.length !== props.le)
            throw new Error('Length does not equal schema length');
        if(props.items) {
            _(param).each(function(item) {
                var oneOf = _(props.items).some(function(schema) {
                    try {
                        return !!schema.validate(item);
                    } catch(err) { 
                        return false; 
                    }
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
