var _ = require('underscore');

var StringValidator = {
    type : 'Duns-string-validator',
    max : null,
    min : null,
    disallowed : [''],
    allowed : [],
    maxlen : function(max) {
        this.max = max;
        return this;
    },
    minlen : function(min) {
        this.min = min;
        return this;
    },
    minlen : function(min) {
        this.min = min;
        return this;
    },
    allow : function(val) {
        if(_(val).isArray() ) {
            this.allowed = this.disallowed.concat(val);
        } else {
            this.allowed.push(val);
        }
        return this;
    },
    deny : function(val) {
        if(_(val).isArray() ) {
            this.disallowed = this.disallowed.concat(val);
        } else {
            this.disallowed.push(val);
        }
        return this;
    },
    validate : function(param) {
        if(_(param).isString() === false) 
            throw "Not string";
        if(_(this.disallowed).contains(param) && _(this.allowed).contains(param) === false )
            throw "Blacklisted value ";
        if(this.max && param.length > this.max)
            throw "Larger than allowed"
        if(this.min && param.length < this.min)
            throw "Larger than allowed"
    }
};

var DunsString = {
};
var DunsSchema = {
    init : function() {
        this.val = {};
    },
    build : function(key,type) {
        this.val[key] = type;
    },
    get : function(key) {
        var ob = this.val[key];
        if(ob === undefined) {
            throw "Not allowed";
        }
        return ob;
    }
};
var Duns = {
    schema : function(keys) {
        var dschema = Object.create(DunsSchema);
        dschema.init();
        _(keys).keys().map(function(key) {
            var val = keys[key];
            dschema.build(key,val);
        });
        return dschema;
    },
    string : function() {
        var svalidator = Object.create(StringValidator);
        return svalidator;
    },
    validate : function(object, schema) {
        _(object).keys().map(function(key) {
            var skey =  schema.get(key);
            if(skey && skey.type === 'Duns-string-validator') {
                skey.validate(object[key]);
                console.log('string!!', object[key]);
            }
        });
        console.error('all good!');
    }
};

var TestSchema = Duns.schema({
    name      : Duns.string().maxlen(10).minlen(5),
    email     : Duns.string(),
    something : Duns.string().allow('')
});
var testobj  = {
    name : 'niklas',
    email : 'silfverstrom@gmail.com',
    something : ''
};
Duns.validate(testobj, TestSchema);



