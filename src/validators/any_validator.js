import _ from 'underscore';

const existConstraints = {
  isRequired: 1,
  isOptional: 2,
  isForbidden: 3,
};

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
      custom: [],
    };
    return this;
  }

  fail(err) {
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

  oneOf(...args) {
    this.props.oneOf = [];
    if (args.length) {
      _(args).map((arg) => {
        if (_(arg).isArray()) {
          this.props.oneOf.concat(arg);
        } else {
          this.props.oneOf.push(arg);
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

  format() {
    if (_(this.formattFunc).isFunction()) {
      return this.formattFunc(this.value, this.siblings);
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
  * @param param optional - parameter to validate.
  * @author Niklas Silfverström<niklas@silfverstrom.com>
  * @since 1.0.0
  * @version 1.0.0
  */
  assert(param) {
    if (!this.validate()) {
      throw new Error('Did not validate');
    }

    return true;
  }
}

export default AnyValidator;
