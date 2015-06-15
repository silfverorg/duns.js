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
      _(param).mapObject((value, key) => {
        const schema = this.props.nested[key];
        if (!schema) throw 'key does not exist';
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
    return _(this.value).mapObject((val, key) => {
      const schema = this.props.nested[key];
      return _(schema.format).isFunction() ? schema.init(val).format() : val;
    });
  }
}

export default ObjectValidator;
