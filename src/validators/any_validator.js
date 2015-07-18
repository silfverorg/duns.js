import _ from 'underscore';

const existConstraints = {
  isRequired: 1,
  isOptional: 2,
  isForbidden: 3,
};

/**
* Base type for validators.
*
* @class
* @author Niklas Silfverström<niklas@silfverstrom.com>
* @since 0.1.0
* @version 1.2.0
*   1.0.0 - initial.
*   1.1.0 - added 'invalid' method.
*/
class AnyValidator {
  constructor(val) {
    this.type = 'Duns-any-validator';
    this._clear();

    this.value = val;

    this._setupBaseSchema();
  }

  _setupBaseSchema() {

    // Generic extensions for all schemas.
    this.extensions = {};

    this._settings = {
      required: existConstraints.isRequired,
    };
  }

  _isOptional() {
    return this._settings.required === existConstraints.isOptional;
  }

  _isRequired() {
    return this._settings.required === existConstraints.isRequired;
  }

  _isForbidden() {
    return this._settings.required === existConstraints.isForbidden;
  }

  required() {
    this._settings.required = existConstraints.isRequired;
    return this;
  }

  optional() {
    this._settings.required = existConstraints.isOptional;
    return this;
  }

  forbidden() {
    this._settings.required = existConstraints.isForbidden;
    return this;
  }

  _clear() {
    this.value       = null;
    this.siblings    = null;
    this.formattFunc = null;
    this.failure     = null;
    this.props = {
      disallow: null,
      allow: null,
      oneOf: null,
      only: null,
      custom: [],
    };
    return this;
  }

  fail(...err) {
    this.failure = err;
    return false;
  }

  custom(cb) {
    if (_(cb).isFunction()) {
      this.props.custom.push(cb);
    }

    return this;
  }

  /**
  * Extends schema with custom function.
  *
  * @param Object with custom methods.
  * @author Niklas Silfverström<niklas@silfverstrom.com>
  * @since 1.0.0
  * @version 1.0.0
  */
  extend(extensions) {
    if (_(extensions).isObject() === false) return this;

    _(extensions).mapObject((func, key) => {

      // Do not override existing.
      if (this[key] === undefined) {
        this[key] = (...param) => {
          this.extensions[key] = { func: func, param: param, };
          return this;
        }
      }
    });

    return this;
  }

  /**
   * Validates with one of schema
   *
   * @name oneOf
   * @function
   * @author Viktor Silfverstrom <viktor@silfverstrom.com>
   * @version 1.0.1 - Fixed an issue with arrays not concating correctly.
   * @access public
   * @return {AnyValidator}
   */
  oneOf(...args) {
    this.props.oneOf = [];
    if (args.length) {
      _(args).map((arg) => {
        if (_(arg).isArray()) {
          this.props.oneOf = this.props.oneOf.concat(arg);
        } else {
          this.props.oneOf.push(arg);
        }
      });

    }

    return this;
  }

  /**
   * Validates with one of values.
   *
   * @name only
   * @function
   * @author Viktor Silfverstrom <viktor@silfverstrom.com>
   * @version 1.0.0
   * @since 1.2.0
   * @access public
   * @return {AnyValidator}
   */
  only(...args) {
    this.props.only = [];
    if (args.length) {
      _(args).each((arg) => {
        if (_(arg).isArray()) {
          this.props.only = this.props.only.concat(arg);
        } else {
          this.props.only.push(arg);
        }
      });
    }

    return this;
  }

  disallow(dis) {
    if (this.props.disallow === null) {
      this.props.disallow = [];
    }

    this.props.disallow = this.props.disallow.concat(dis);
    return this;
  }

  allow(allow) {
    if (this.props.allow === null) {
      this.props.allow = [];
    }

    this.props.allow = this.props.allow.concat(allow);
    return this;
  }

  returns(param) {
    if (_(param).isFunction()) {
      this.formattFunc = param;
    }

    return this;
  }

  init(param, siblings) {
    this.value = param;
    this.siblings = siblings;
    return this;
  }

  format(arg) {
    const value = (arg === undefined) ? this.value : arg;
    if (_(this.formattFunc).isFunction()) {
      return this.formattFunc(value, this.siblings);
    }

    return this.value;
  }

  validate(arg) {
    const param = (arg === undefined) ? this.value : arg;
    const props = this.props;

    // Check custom functions
    try {
      _(this.extensions).mapObject((obj, key) => {
        const func   = obj.func;
        if (!func.apply(this, [param].concat(obj.param))) {
          throw 'Failed';
        }
      });
    } catch (err) {
      return this.fail(err);
    }

    //Always allow whitelist values
    if (props.allow && _(props.allow).contains(param)) return true;

    //Check if there have been specified an only prop.
    //If there has, we can safely assume that this check will be sufficent.
    //This has to be done before the null || undefined check to allow those values.
    if (props.only && _(props.only).isArray()) {
      const onlyValid = _(props.only).any((num) => {
        return arg === num;
      });

      if (!onlyValid) return this.fail('only did not validate');
      return onlyValid;
    }

    //Return false for null or undefined value.
    if (param === null || param === undefined) return false;

    if (props.disallow && _(props.disallow).contains(param)) {
      return this.fail('Value is blacklisted');
    }

    if (props.custom && props.custom.length > 0) {
      for (let i = 0; i < props.custom.length; i++) {
        const cb = props.custom[i];
        const res = cb(param);
        if (!res) return this.fail('cb not validated');
      }
    }

    if (props.oneOf && _(props.oneOf).isArray()) {
      try {
        let ok = false;
        for (let x = 0; x < props.oneOf.length; x++) {
          let schema = props.oneOf[x];
          ok = schema.validate(param);
          if (ok) break;
        }

        if (ok === false) {
          return this.fail('Not one of schemas');
        }
      } catch (err) {
        return this.fail('Not one of schemas');
      }
    }

    return true;
  }

  /**
  * Asserts that object is valid according to schema, throws otherwise.
  *
  * Exactly like validate, but instead of returning false throws an exception.
  *
  * @param {mixed} param (optional) - value to validate.
  * @author Niklas Silfverström<niklas@silfverstrom.com>
  * @since 1.0.0
  * @version 1.0.0
  */
  assert(param) {
    if (!this.validate(param)) {
      throw new Error('Did not validate');
    }

    return true;
  }

  /**
  * Runs validate on schema, but returns true if schema is invalid.
  *
  * @param {mixed} param (optional) - value to validate.
  * @author Niklas Silfverström<niklas@silfverstrom.com>
  * @since 1.1.0
  * @version 1.0.0 - initial.
  */
  invalid(param) {
    return !this.validate(param);
  }
}

export default AnyValidator;
