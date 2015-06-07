import _ from 'underscore';

//RFC822 email validator
import isEmail from './is_email';

import ObjectValidator from './validators/object_validator';
import StringValidator from './validators/string_validator';
import ArrayValidator from './validators/array_validator';
import NumberValidator from './validators/number_validator';

import DunsSchema from './duns_schema';

class Duns {
  constructor() {
    this.err = null;
  }

  o(keys) {
    return this.schema(keys);
  }

  error() {
    return this.error;
  }

  schema(keys) {
    let dschema = new DunsSchema();

    _(keys).keys().map( (key) => {
      let val = keys[key];
      dschema.build(key, val);
    });

    return dschema;
  }

  string() {
    return new StringValidator();
  }

  array() {
    return new ArrayValidator();
  }

  number() {
    return new NumberValidator();
  }

  object() {
    return new ObjectValidator();
  }

  _validateSingle(object, schema) {
    let ok = true;
    if (_(object).isObject() && _(object).isArray() === false) {
      _(object).keys().map( (key) => {
        try {
          let skey = schema.get(key);
          if (skey && skey.type === 'Duns-string-validator') {
                  skey.validate(object[key]);
          } else if (skey && skey.type === 'Duns-number-validator') {
                  skey.validate(object[key]);
          } else if (skey && skey.type === 'Duns-array-validator') {
                  skey.validate(object[key]);
          } 
        } catch(err) {
          this.err = err;
          ok = false;
        }
      });
    } else {
      try {
        schema.validate(object);
      } catch(err) {
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
      _(object).keys().map( (key) => {
        try {
          let s = schema.get(key);
          if (s.type === 'Duns-schema') {
              if( !Duns.validate(object[key], s) ) {
                  ok = false;
              }
          } else {
              if( !Duns._validateSingle(object[key], s) ) {
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
