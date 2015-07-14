import _ from 'underscore';

//RFC822 email validator
import isEmail from './is_email';

import ObjectValidator from './validators/object_validator';
import StringValidator from './validators/string_validator';
import ArrayValidator from './validators/array_validator';
import NumberValidator from './validators/number_validator';
import DateValidator from './validators/date_validator';
import AnyValidator from './validators/any_validator';
import BooleanValidator from './validators/boolean_validator';

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

  string(val) {
    return new StringValidator(val);
  }

  array(val) {
    return new ArrayValidator(val);
  }

  bool(val) {
    return new BooleanValidator(val);
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

  _clear() {
    this.err = null;
  }

  validate(object, schema) {

    switch (schema.type) {
      case 'Duns-string-validator':
        return schema.validate(object);
      case 'Duns-number-validator':
        return schema.validate(object);
      case 'Duns-date-validator':
        return schema.validate(object);
      case 'Duns-any-validator':
        return schema.validate(object);
      case 'Duns-array-validator':
        return schema.validate(object);
      case 'Duns-object-validator':
        return schema.validate(object);
      default:
        return false;
    };
    return false;
  }

  assert(object, schema) {
    if (schema && _(schema.assert).isFunction()) {
      return schema.assert(object);
    }
  }

  invalid(object, schema) {
    if (schema && _(schema.invalid).isFunction()) {
      return schema.invalid(object);
    }
  }

}

export default new Duns();
