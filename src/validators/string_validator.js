var _ = require('underscore');

var StringValidator = {
    type : 'Duns-string-validator',
    _clear : function() {
        this.props = {
            max : null,
            min : null,
            useEmail : null,
            disallowed : [''],
            allowed : [],
            exactLength : null
        };
        return this;
    },
    maxlen : function(max) {
        this.props.max = max;
        return this;
    },
    minlen : function(min) {
        this.props.min = min;
        return this;
    },
    length : function(l) {
        this.props.exactLength = l;
        return this;
    },
    email : function() {
        this.props.useEmail = true;
        return this;
    },
    allow : function(val) {
        if(_(val).isArray() ) {
            this.props.allowed = this.disallowed.concat(val);
        } else {
            this.props.allowed.push(val);
        }
        return this;
    },
    deny : function(val) {
        if(_(val).isArray() ) {
            this.props.disallowed = this.disallowed.concat(val);
        } else {
            this.props.disallowed.push(val);
        }
        return this;
    },
    validate : function(param) {
        var props = this.props;
        if(_(param).isString() === false) 
            throw new Error('Value is not string');
        if(_(props.disallowed).contains(param) && _(props.allowed).contains(param) === false )
            throw new Error('Value is blacklisted');
        if(props.max && param.length > props.max)
            throw new Error('Argument length is larger than allowed');
        if(props.min && param.length < props.min)
            throw new Error('Argument length is less than allowed');
        if(props.exactLength && param.length !== props.exactLength)
            throw new Error('Argument has invalid length');
        if(props.useEmail && isEmail(param) === false) 
            throw new Error('Argument is not valid RFC822 email');
            return true;
    }
};

module.exports = StringValidator;
