import _ from 'underscore';
import DunsSchema from '../duns_schema';

class ObjectValidator {
  constructor() {
    this.type = 'Duns-object-validator';
    this._clear();
  }

  _clear() {
    this.props = {};
    return this;
  }

  validate(param) {
    if (_(param).isObject() === false) {
      throw new Error('Not a valid object');
    }

    return true;
  }

  keys(keys) {
    let dschema = new DunsSchema();
    _(keys).keys().map((key) => {
      let val = keys[key];
      dschema.build(key, val);
    });

    return dschema;
  }

  format() {
    if (_(this.formattFunc).isFunction()) {
      return this.formattFunc(this.value);
    }

    return this.value;
  }
}

export default ObjectValidator;
