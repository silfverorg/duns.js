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
    let param = (arg === undefined) ? this.value : arg;

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

      // Check if invalid keys exist in object.
      if (_.difference(_(param).keys(), _(this.props.nested).keys()).length !== 0) throw 'Invalid values in object';
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

  format(arg) {
    const value = (arg === undefined) ? this.value : arg;

    return _(this.props.nested).mapObject((schema, key) => {
      const val = value[key];
      if (!schema) return val;
      return _(schema.format).isFunction() ? schema.init(val, value).format() : val;
    });
  }
}

export default ObjectValidator;
