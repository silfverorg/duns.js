'use strict';

var _ = require('underscore');
var DunsSchema = require('../duns_schema');

var ObjectValidator = {
    type: 'Duns-object-validator',
    _clear: function _clear() {
        this.props = {};
        return this;
    },
    validate: function validate(param) {
        if (_(param).isObject() == false) throw new Error('Not object');
        return true;
    },
    keys: function keys(_keys) {
        var dschema = Object.create(DunsSchema);
        dschema.init();
        _(_keys).keys().map(function (key) {
            var val = _keys[key];
            dschema.build(key, val);
        });
        return dschema;
    }
};

module.exports = ObjectValidator;