import _ from 'underscore';
import AnyValidator from './any_validator';

/**
* Creates an object schema, that validates a given object.
*
* @class
* @author Niklas Silfverström<niklas@silfverstrom.com>
* @since 0.1.0
* @version 1.1.0
*   1.0.0 - initial.
*   1.1.0 - Added allowAllKeys.
*/
class ObjectValidator extends AnyValidator {
  constructor(value) {
    super(value);
    this.type = 'Duns-object-validator';
    this._clear();
  }

  _clear() {
    this.props = {
      allowAllKeys: false,
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
        if (!schema && schema._isRequired()) throw new Error('key does not exist');
        if (!schema.validate(value)) throw new Error('Not valid');
      });

      // Check if invalid keys exist in object.
      if (!this.props.allowAllKeys && _.difference(_(param).keys(),
        _(this.props.nested).keys()).length !== 0) {
        throw new Error('Invalid values in object');
      }
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
  /**
  * Allows none defined keys to exist in object.
  *
  * Normally, an object schema fails if non specified keys exist in the object.
  * When using 'allowAllKeys' - schema only looks at specified keys, and ignores all others.
  * @author Niklas Silfverström<niklas@silfverstrom.com>
  * @since 1.1.0
  * @version 1.0.0
  */
  allowAllKeys() {
    this.props.allowAllKeys = true;
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
