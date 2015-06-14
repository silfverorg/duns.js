import _ from 'underscore';

//RFC822 email validator
import isEmail from './is_email';

import ObjectValidator from './validators/object_validator';
import StringValidator from './validators/string_validator';
import ArrayValidator from './validators/array_validator';
import NumberValidator from './validators/number_validator';
import DateValidator from './validators/date_validator';
import AnyValidator from './validators/any_validator';

import DunsSchema from './duns_schema';

class Duns {
  constructor() {
    this.err = null;
  }

  o(keys) {
    return this.schema(keys);
  }

  error() {
    return this.err;
  }

  schema(keys) {
    let dschema = new DunsSchema();

    _(keys).keys().map((key) => {
      let val = keys[key];
      dschema.build(key, val);
    });

    return dschema;
  }

  string(val) {
    return new StringValidator(val);
  }

  array(val) {
    return new ArrayValidator(val);
  }

  number(val) {
    return new NumberValidator(val);
  }

  object(val) {
    return new ObjectValidator(val);
  }

  any(val) {
    return new AnyValidator(val);
  }

  date(val) {
    return new DateValidator(val);
  }

  _validateSingle(object, schema) {
    let ok = true;
    if (_(object).isObject() && _(object).isArray() === false) {
      _(object).keys().map((key) => {
        try {
          let skey = schema.get(key);
          let ret = false;
          if (skey && skey.type === 'Duns-string-validator') {
            ret = skey.validate(object[key]);
          } else if (skey && skey.type === 'Duns-number-validator') {
            ret = skey.validate(object[key]);
          } else if (skey && skey.type === 'Duns-array-validator') {
            ret = skey.validate(object[key]);
          } else if (skey && skey.type === 'Duns-date-validator') {
            ret = skey.validate(object[key]);
          } else if (skey && skey.type === 'Duns-any-validator') {
            ret = skey.validate(object[key]);
          }
          if(!ret) throw '';
        } catch (err) {
          this.err = err;
          ok = false;
        }
      });
    } else {
      try {
        let ret = schema.validate(object);
        if(!ret) throw '';
      } catch (err) {
        this.err = err;
        ok = false;
      }
    }

    return ok;
  }

  _clear() {
    this.err = null;
  }

  validate(object, schema) {
    //clear messages
    this._clear();
    let ok = true;

    if (_(object).isObject() && _(object).isArray() === false) {
      _(object).keys().map((key) => {
        try {
          let s = schema.get(key);
          if (s.type === 'Duns-schema') {
            if (!Duns.validate(object[key], s)) {
              ok = false;
            }
          } else {
            if (!this._validateSingle(object[key], s)) {
              ok = false;
            }
          }
        } catch (err) {
          this.err = false;
          ok = false;
        }
      });
    } else {
      try {
        ok = schema.validate(object);
      } catch (err) {
        this.err = err;
        ok = false;
      }
    }

    return ok;
  }

}

export default new Duns();
