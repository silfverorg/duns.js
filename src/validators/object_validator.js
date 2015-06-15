import _ from 'underscore';
import AnyValidator from './any_validator';

class ObjectValidator extends AnyValidator {
  constructor(value) {
    super(value);
    this.type = 'Duns-object-validator';
    this._clear();
  }

  _clear() {
    this.props = {
      nested: {},
      custom: [],
    };
    return this;
  }

  validate(arg) {
    if (!super.validate(arg)) return false;
    let param = arg || this.value;

    if (_(param).isObject() === false) {
      return this.fail('Not a valid object');
    }

    try {
      _(this.props.nested).mapObject((schema, key) => {
        const value = param[key];

        if (value === undefined && schema && schema._isForbidden()) return true;
        if (value !== undefined && schema && schema._isForbidden()) throw 'Forbidden value';

        if (value === undefined && schema && schema._isOptional()) return true;
        if (!schema && schema._isRequired()) throw 'key does not exist';
        if (!schema.validate(value)) throw 'Not valid';
      });
    } catch (err) {
      return this.fail(err);
    }

    return true;
  }

  keys(keys) {
    _(keys).mapObject((schema, key) => {
      this.props.nested[key] = schema;
    });

    return this;
  }

  format() {
    return _(this.props.nested).mapObject((schema, key) => {
      const val = this.value[key];
      if (!schema) return val;
      return _(schema.format).isFunction() ? schema.init(val, this.value).format() : val;
    });
  }
}

export default ObjectValidator;
