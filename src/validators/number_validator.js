var _ = require('underscore');
var DunsSchema = require('../duns_schema');
var NumberExtension = {};

var NumberValidator = {
    type : 'Duns-object-validator',
    extension : NumberExtension,
    _clear : function() {
        this.props = {
            extension : {},
            max       : null,
            min       : null,
            greater   : null,
            less      : null,
            positive  : null,
            negative  : null
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
    extend : function(extension) { 
        var that = this;
        _.each(_(extension).keys(), function(key) {
            var func = extension[key];
            NumberValidator[key] = function() {
                that.props.extension[key] = { args : Array.prototype.slice.call(arguments), func : func }; 
                return that;
            }
        });
    },
    validate : function(param) {
        var that = this;
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

        //Loop through added custom vals
        _.each(_(this.props.extension).keys(), function(key) {
            var method = that.props.extension[key];
            var res = method.func.apply(that,[param].concat(method.args));
            if(!res) { 
                throw new Error('Custom failed')
            }
        });
        return true;
    },
};

module.exports = NumberValidator;
