var _ = require('underscore');
var DunsSchema = require('../duns_schema');

var NumberValidator = {
    type : 'Duns-object-validator',
    _clear : function() {
        this.props = {
            max : null,
            min : null,
            greater : null,
            less : null,
            positive : null,
            negative : null,
        };
        return this;
    },
    max : function(s) {
        this.props.max = s;
        return this;
    },
    min : function(s) {
        this.props.min = s;
        return this;
    },
    greater : function(s) {
        this.props.greater = s;
        return this;
    },
    less : function(s) {
        this.props.less = s;
        return this;
    },
    positive : function() {
        this.props.positive = true;
        return this;
    },
    negative : function() {
        this.props.negative = true;
        return this;
    },
    validate : function(param) {
        if( _(param).isNumber() == false)
            throw new Error('Not number');
        if(this.props.max && param > this.props.max)
            throw new Error('Invalid length');
        if(this.props.min && param < this.props.min)
            throw new Error('Invalid length');
        if(this.props.less && param > this.props.less)
            throw new Error('Invalid length');
        if(this.props.greater && param < this.props.greater)
            throw new Error('Invalid length');
        if(this.props.negative && param >= 0 )
            throw new Error('Not negative');
        if(this.props.positive && param < 0 )
            throw new Error('Not positive');
        return true;
    },
};

module.exports = NumberValidator;
