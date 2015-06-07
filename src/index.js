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
    let dschema = Object.create(DunsSchema);
    dschema.init();
    _(keys).keys().map( (key) => {
      let val = keys[key];
      dschema.build(key, val);
    });

    return dschema;
  }

  string() {
    console.error('string');
    return Object.create(StringValidator)._clear();
  }

  array() {
    return new ArrayValidator()._clear();
  }

  number() {
    return Object.create(NumberValidator)._clear();
  }

  object() {
    return Object.create(ObjectValidator)._clear();
  }

  _validateSingle(object, schema) {
    let ok = true;
    if (_(object).isObject() && _(object).isArray() === false) {
      _(object).keys().map( (key) => {
        try {
          let skey = schema.get(key);
          if(skey && skey.type === 'Duns-string-validator') {
                  skey.validate(object[key]);
          } else if(skey && skey.type === 'Duns-number-validator') {
                  skey.validate(object[key]);
          } else if(skey && skey.type === 'Duns-array-validator') {
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
          this.err = false;
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

}

export default new Duns();
