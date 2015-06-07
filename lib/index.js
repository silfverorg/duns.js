'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

//RFC822 email validator

var _is_email = require('./is_email');

var _is_email2 = _interopRequireDefault(_is_email);

var _validatorsObject_validator = require('./validators/object_validator');

var _validatorsObject_validator2 = _interopRequireDefault(_validatorsObject_validator);

var _validatorsString_validator = require('./validators/string_validator');

var _validatorsString_validator2 = _interopRequireDefault(_validatorsString_validator);

var _validatorsArray_validator = require('./validators/array_validator');

var _validatorsArray_validator2 = _interopRequireDefault(_validatorsArray_validator);

var _validatorsNumber_validator = require('./validators/number_validator');

var _validatorsNumber_validator2 = _interopRequireDefault(_validatorsNumber_validator);

var _duns_schema = require('./duns_schema');

var _duns_schema2 = _interopRequireDefault(_duns_schema);

var Duns = (function () {
  function Duns() {
    _classCallCheck(this, Duns);

    this.err = null;
  }

  _createClass(Duns, [{
    key: 'o',
    value: function o(keys) {
      return this.schema(keys);
    }
  }, {
    key: 'error',
    value: function error() {
      return this.error;
    }
  }, {
    key: 'schema',
    value: function schema(keys) {
      var dschema = Object.create(_duns_schema2['default']);
      dschema.init();
      (0, _underscore2['default'])(keys).keys().map(function (key) {
        var val = keys[key];
        dschema.build(key, val);
      });

      return dschema;
    }
  }, {
    key: 'string',
    value: function string() {
      console.error('string');
      return Object.create(_validatorsString_validator2['default'])._clear();
    }
  }, {
    key: 'array',
    value: function array() {
      return new _validatorsArray_validator2['default']()._clear();
    }
  }, {
    key: 'number',
    value: function number() {
      return Object.create(_validatorsNumber_validator2['default'])._clear();
    }
  }, {
    key: 'object',
    value: function object() {
      return Object.create(_validatorsObject_validator2['default'])._clear();
    }
  }, {
    key: '_validateSingle',
    value: function _validateSingle(object, schema) {
      var _this = this;

      var ok = true;
      if ((0, _underscore2['default'])(object).isObject() && (0, _underscore2['default'])(object).isArray() === false) {
        (0, _underscore2['default'])(object).keys().map(function (key) {
          try {
            var skey = schema.get(key);
            if (skey && skey.type === 'Duns-string-validator') {
              skey.validate(object[key]);
            } else if (skey && skey.type === 'Duns-number-validator') {
              skey.validate(object[key]);
            } else if (skey && skey.type === 'Duns-array-validator') {
              skey.validate(object[key]);
            }
          } catch (err) {
            _this.err = err;
            ok = false;
          }
        });
      } else {
        try {
          schema.validate(object);
        } catch (err) {
          this.err = err;
          ok = false;
        }
      }
      return ok;
    }
  }, {
    key: '_clear',
    value: function _clear() {
      this.err = null;
    }
  }, {
    key: 'validate',
    value: function validate(object, schema) {
      var _this2 = this;

      //clear messages
      this._clear();
      var ok = true;

      if ((0, _underscore2['default'])(object).isObject() && (0, _underscore2['default'])(object).isArray() === false) {
        (0, _underscore2['default'])(object).keys().map(function (key) {
          try {
            var s = schema.get(key);
            if (s.type === 'duns-schema') {
              if (!Duns.validate(object[key], s)) {
                oki = false;
              }
            } else {
              if (!Duns._validateSingle(object[key], s)) {
                oki = false;
              }
            }
          } catch (err) {
            _this2.err = false;
            ok = false;
          }
        });
      } else {
        try {
          oki = schema.validate(object);
        } catch (err) {
          this.err = err;
          ok = false;
        }
      }

      return ok;
    }
  }]);

  return Duns;
})();

exports['default'] = new Duns();
module.exports = exports['default'];