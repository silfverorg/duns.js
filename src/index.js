var _ = require('underscore');

//RFC822 email validator
var isEmail = require('./is_email')

var ObjectValidator = require('./validators/object_validator');
var StringValidator = require('./validators/string_validator');
var ArrayValidator = require('./validators/array_validator');
var NumberValidator = require('./validators/number_validator');
var DunsSchema = require('./duns_schema');

var Duns = {
    err : null, //last error
    o : function(keys) {
        return this.schema(keys);
    },
    error : function() {
        return this.err;
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
    array : function() {
        var svalidator = new ArrayValidator();
        svalidator._clear();
        return svalidator;
    },
    number : function() {
        var svalidator = Object.create(NumberValidator)._clear();
        return svalidator;
    },
    object : function() {
        var svalidator = Object.create(ObjectValidator)._clear();
        return svalidator;
    },
    _validateSingle : function(object, schema) {
        var that = this;
        var ok = true;
        if( _(object).isObject() && _(object).isArray() === false) {
            _(object).keys().map(function(key) {
                try {
                    var skey =  schema.get(key);
                    if(skey && skey.type === 'Duns-string-validator') {
                            skey.validate(object[key]);
                    } else if(skey && skey.type === 'Duns-number-validator') {
                            skey.validate(object[key]);
                    } else if(skey && skey.type === 'Duns-array-validator') {
                            skey.validate(object[key]);
                    } 
                } catch(err) {
                    that.err = err;
                    ok = false;
                }
            });
        } else {
            try {
                schema.validate(object);
            } catch(err) {
                that.err = err;
                ok = false;
            }
        }
        return ok;
    },
    _clear : function() {
        this.err = null;
    },
    validate : function(object,schema) {
        this._clear(); //clear messages
        var that = this;
        var oki = true;
        if(_(object).isObject() && _(object).isArray() === false) {
            _(object).keys().map(function(key) {
                try {
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
                } catch (err) {
                    that.err = err;
                    oki = false;
                }
            });
        } else { 
            try {
                oki = schema.validate(object);
            } catch (err) {
                that.err = err;
                oki = false;
            }
        }
        return oki;
    }
};

module.exports = Duns;
