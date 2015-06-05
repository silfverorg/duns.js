var _ = require('underscore');

//RFC822 email validator
var isEmail = require('./is_email')

var ObjectValidator = require('./validators/object_validator');
var StringValidator = require('./validators/string_validator');

var DunsSchema = {
    type : 'duns-schema',
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
    o : function(keys) {
        return this.schema(keys);
    },
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
        var svalidator = Object.create(StringValidator)._clear();
        return svalidator;
    },
    object : function() {
        var svalidator = Object.create(ObjectValidator)._clear();
        return svalidator;
    },
    _validateSingle : function(object, schema) {
        var ok = true;
        if( _(object).isObject() ) {
            _(object).keys().map(function(key) {
                var skey =  schema.get(key);
                if(skey && skey.type === 'Duns-string-validator') {
                    try {
                        skey.validate(object[key]);
                    } catch(err) {
                        ok = false;
                    }
                } else {
                }
            });
        } else {
            try {
                schema.validate(object);
            } catch(err) {
                ok = false;
            }
        }
        return ok;
    },
    validate : function(object,schema) {
        var oki = true;
        if(_(object).isObject() ) {
            _(object).keys().map(function(key) {
                var s = schema.get(key);
                if(s.type === 'duns-schema') {
                    if( !Duns.validate(object[key], s) ) {
                        oki = false;
                    }
                } else {
                    if( !Duns._validateSingle(object[key], s) ) {
                        oki = false;
                    }
                }
            });
        }
        return oki;
    }
};

var test = { deal : { ninja : 'hej' } };
var test2 = {
    deal : {
        ninja : {
            pirate : 'hej'
        }
    }
};
var f = Duns.schema({
    deal : Duns.schema({
        ninja : Duns.schema({
            pirate : Duns.string().minlen(2)
        })
    })
});

console.log(Duns.validate(test, f) );

module.exports = Duns;
